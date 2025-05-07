import {db} from '../libs/db.js'
import { getJudge0LanguageId, submitBatch } from '../libs/judge0.libs.js'

export const createProblem = async (req, res, next) => {
    //get data from body
    const {title, description, difficulty, tags, examples, constrains, testcases, codeSnippet, referenceSolution} = req.body

    //check role
    if(req.user.role !== "ADMIN"){
        return res.status(403).json({
            error: "You are not allowed to create a problem"
        })
    }

    try {
        
        for (const [language, solutionCode] of Object.entries(referenceSolution)) {
            const languageId = getJudge0LanguageId(language);

            if(!languageId) {
                return res.status(400).json({error: `${language} is not supported`})
            }

            //
            const submissions = testcases.map(({input, output}) => ({
                source_code: solutionCode,
                language_id: languageId,
                stdin: input,
                expected_output: output,

            }))

            const submissionResult = await submitBatch(submissions)

            const token =  submissionResult.map((res)=> res.token)

            const results = await pollBatchResults(token)

            for(let i=0 ; i<results.length; i++){
                const result = results[i]

                if(result.staus.id !== 3){
                    return res.status(400).json({error: `testcase ${i+1} failed for language ${language}`})
                }
            }

            const newProblem = await db.problem.create({
                data: {
                    title, description, difficulty, tags, examples, constrains, testcases, codeSnippet, referenceSolution, userId: req.user.id
            
                }
            })

            return res.status(201).json(newProblem)
        }


    } catch (error) {
        
    }
}

export const getAllProblems = async(req, res, next) => {
    
}
export const getAllProblemById = async(req, res, next) => {

}
export const updateProblemById = async(req, res, next) => {

}
export const deleteProblem = async(req, res, next) => {

}
export const getAllProblemSolvedByUser = async(req, res, next) => {

}