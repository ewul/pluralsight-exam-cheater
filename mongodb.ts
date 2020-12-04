import connect from 'mongodb';
import { SkillAssessment, Question, VersionConfiguration } from './beans';

const url = "mongodb://wqdcsrv260.cn.infra:27017/admin";
let client: connect.MongoClient;

const getMongoClient = async () => {
    if (!client){
        client = await connect.connect(url, { auth: { user: "admin", password: "1qazXSW@3edc" } });
    }
    return client;
}

export const updateAssessments = (doc: SkillAssessment) => {
    let collectionName = "skillAssessment";
    getMongoClient().then((client: connect.MongoClient) => {
        let db = client.db("admin");
        // if (!db.listCollections({ name: collectionName }).hasNext()) {
        //     console.log("Creating collection " + collectionName);
        //     db.createCollection(collectionName);
        // }
        let collection = db.collection(collectionName);
        collection.find({ "stem": doc.stem }).hasNext().then(
            (hasNext) => {
                if (hasNext){
                    console.log("skip assessment item: " + doc.assessment_item_id);
                }
                else{
                    console.log("insert: "+ doc.assessment_item_id);
                    collection.insertOne(doc);
                }
            }
        );
    });
}

export const findAnswer = async (question: Question) => {
    let collectionName = "skillAssessment";
    return getMongoClient().then( async (client: connect.MongoClient) => {
        let db = client.db("admin");
        let collection = db.collection(collectionName);
        return collection.findOne({ "stem": question.ctx.stem })
        .then(
            (skillAssessment: SkillAssessment) => {
                if (skillAssessment) {
                    return skillAssessment.choices[skillAssessment.answer_index];
                }else{
                    return null;
                }
            }
        )
    });
}

export const getVersionConfiguration = async () => {
    let collectionName = "configurations";
    return getMongoClient().then(async (client: connect.MongoClient)=>{
        let db = client.db("admin");
        let collection = db.collection(collectionName);
        return collection.findOne({ "type": "version" });
    })
}