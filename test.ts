import { url } from "inspector";
import { updateAssessments, findAnswer } from './mongodb';
import { Question } from './beans';

function main() {
    findAnswer(
        {
            state: "",
            ctx: {
                stem: "<p>Which statement is true regarding typing in TypeScript?\n</p>",
                choices: [],
                timer: 0,
                totalTime: 0,
                id: 0,
                answer_index: 0,
        
            }
        
        }
    
    ).then(
        (answer) => {
            console.log(answer);
        }
    );
}
 
main();