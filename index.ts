import puppeteer from 'puppeteer';
import fs from 'fs';
import { Role, Skill, SkillAssessment,Question } from './beans';
import { updateAssessments, findAnswer } from './mongodb';
import { versionCheck } from './version';

const libraryUrl = 'https://app.pluralsight.com/library/'

let browser: Promise<puppeteer.Browser>;

let openBrowser = async () => {
    return puppeteer.launch({
        args: ['--start-maximized', '--disable-infobars'],
        defaultViewport: null,
        headless: false,
        executablePath: "./chrome-win/chrome.exe",
    });
}

let getBrowser = async () => {
    if (browser === undefined) {
        browser = openBrowser();
    }
    return browser;
}

let saveCookie = (page: puppeteer.Page) => {
    page.cookies().then(cookies => {
        if(cookies.length>0){
            fs.writeFileSync('./pluralsight.cookie', JSON.stringify(cookies));
        }
    });
}

let applyCookie = async (page: puppeteer.Page) => {
    if (fs.existsSync('./pluralsight.cookie')) {
        let cookies: puppeteer.SetCookie[] = <puppeteer.SetCookie[]>JSON.parse(fs.readFileSync('./pluralsight.cookie').toString())
        await page.setCookie(...cookies);
    }
}

let saveSkills = (page: puppeteer.Page, response: puppeteer.Response) => {
    let skills: Skill[] = [];
    response.text().then(
        (body) => {
            if (body) {
                try {
                    let role: Role = JSON.parse(body);
                    if (role && role.id && role.name) {
                        console.log(JSON.stringify(role.id));
                        console.log(JSON.stringify(role.name));
                        role.skills.forEach((skill: Skill) => {
                            skills.push(skill);
                        });
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            skills.forEach((skill) => {
                if (skill.userAssessmentStatus != "not started"){
                    crawlSkillAssessments(page, skill.assessmentId);
                }
            });

        }
    );
}

let crawlSkillAssessments = (page: puppeteer.Page, assessmentId: string) => {
    //https://app.pluralsight.com/score/skill-assessment/planning-tracking-releasing-jira/summary-review/data/questions/19
    //https://app.pluralsight.com/score/skill-assessment/planning-tracking-releasing-jira/summary-review/data
    console.log("start crawling skill assessment " + assessmentId);
    let interactionCount = 0;
    page.evaluate((assessmentId) => {
        return fetch("https://app.pluralsight.com/score/skill-assessment/" + assessmentId + "/summary-review/data", { method: 'GET' }).then((res: any) => res.json());
    }, assessmentId).then((res) => {
        if (res && res.data && res.data.interactionCount) {
            interactionCount = res.data.interactionCount;
        }
    }, (reason) => {console.warn(reason);}).then(() => {
        for(let i=1; i<=interactionCount; i++){
            page.evaluate((assessmentId, index) => {
                return fetch(
                    "https://app.pluralsight.com/score/skill-assessment/" + assessmentId + "/summary-review/data/questions/" + index,
                    { method: 'GET' })
                    .then((res: any) => {
                        return res.json();
                    });
            }, assessmentId, i)
            .then((res) => {
                if (res) {
                    if (res.status == "success" && res.data) {
                        let skillAssessment: SkillAssessment = res.data;
                        skillAssessment.skill = assessmentId;
                        updateAssessments(skillAssessment);
                    }
                }
            });        
        }
    });
}

let showAnswer= (page: puppeteer.Page, response: puppeteer.Response) =>{
    response.text().then(
        (body) => {
            try {
                let question: Question = JSON.parse(body).data;
                if (question.state == "question") {
                    console.log("Question detected. Finding answer ...");
                    findAnswer(question).then(
                        (answer) => {
                            console.log(answer);
                            if(answer){
                                page.evaluate((answer) => {
                                    setTimeout(
                                        () => {
                                            alert(answer);
                                        }, 1000
                                    );
                                }, answer);
                            }
                            else {
                                page.evaluate(() => {
                                    setTimeout(
                                        () => {
                                            alert("没找到");
                                        }, 1000
                                    );
                                });
                            }
                        }
                    );
                } else {
                    console.log("Saving answer ...");
                    let skillAssessment: SkillAssessment = {
                        skill: response.url().split('/')[5],
                        assessment_item_id: question.ctx.id,
                        format: "",
                        stem: question.ctx.stem,
                        stem_image_url: "",
                        answer_index: question.ctx.answer_index,
                        choices: question.ctx.choices            
                    };
                    updateAssessments(skillAssessment);
                }
            }
            catch (e) {
                console.error(e);
            }
        }
    );
}

(async () => {

    let valid = await versionCheck();
    if (typeof(valid) == "string") {
        console.warn('请考虑升级到V'+valid);
    } else if(!valid) {
        console.error('此版本已不可用，请升级!');
        return;
    }

    let mainPage = (await (await getBrowser()).pages())[0]

    mainPage.on("response", (response) => {
        try {
            const url = response.url();
            if (url.match(".*/id/signin/.*")) {
                console.log("signin page");
                return;
            }
            if (url.match(".*/library/")) {
                console.log("saving cookies");
                saveCookie(mainPage);
            }
            if (url.match(".*/roleiq/api/roles/.*")) {
                //https://app.pluralsight.com/roleiq/api/roles/123af7ad-8b5f-4477-948c-a5e3073625b9
                console.log("role selected");
                saveSkills(mainPage, response);
            }
            if (url.match(".*/score/skill-assessment/.*/run$") || 
            url.match(".*/score/skill-assessment/.*/run\?.*")) {
                console.log("running examing");
                console.log(response.url());
                showAnswer(mainPage, response);
            }
        }
        catch (e) {
            console.error(e);
        }
    })

    applyCookie(mainPage).then(
        () => {
            mainPage.goto(
                libraryUrl,
                {
                    timeout: 10 * 60 * 1000
                }
            );
        }
    );

    //await (await getBrowser()).close();
})().catch((error) => {
    console.log("Error:" + error.message);
    getBrowser().then((browser) => browser.close());
});
