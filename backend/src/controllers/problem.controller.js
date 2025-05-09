import {db} from '../libs/db.js'
import { getJudge0LanguageId, submitBatch, pollBatchResults } from '../libs/judge0.libs.js'

export const createProblem = async (req, res) => {
    //get data from body
    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions} = req.body

    //check role
    if(req.user.role !== "ADMIN"){
        return res.status(403).json({
            error: "You are not allowed to create a problem"
        })
    }
    
    try {
        
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
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
                console.log("Result -----", results)

                // console.log(
                //     `Testcase ${i+1} and language ${language} ---- result ${JSON.stringify(result.status.description)}`
                // )

                if(result.status.id !== 3){
                    return res.status(400).json({
                        error: `testcase ${i+1} failed for language ${language}`
                    })
                }
            }
        }
        const newProblem = await db.problem.create({
                data: {
                    title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions, userId: req.user.id
            
                }
            })

        return res.status(201).json({
            success: true,
            message: "Problem created successfully",
            problem: newProblem
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error while creating problem",
        })   
    }
}
export const getAllProblems = async(req, res) => {
    try {
        const problems = await db.problem.findMany()

        if(!problems){
            return res.status(404).json({
                error: "no problem found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Problem fetched successfully",
            problems
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error while fetching problem",
        }) 
    }
}
export const getAllProblemById = async(req, res) => {
    const {id} = req.params

    try {
        const problem = await db.problem.findUnique({
            where : {
                id
            }
        })

        if(!problem){
            return res.status(404).json({
                error: "problem not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Problem fetched by Id successfully",
            problem
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error while fetching problem by Id",
        }) 
    }
}
export const updateProblemById = async(req, res) => {
    //get id from param
    //id ---> problem
    //baaki same as create
    //instead of create use update
}
export const deleteProblem = async(req, res) => {
    const {id} = req.params

    try {
        const problem = await db.problem.findUnique({
            where : {
                id
            }
        });
        
        if(!problem){
            return res.status(404).json({
                error: "Problem not found"
            })
        }

        await db.problem.delete({
            where: {
                id
            }
        })

        return res.status(200).json({
            success: true,
            message: "problem deleted successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Error while deleting problem by Id",
        }) 
    }
}
export const getAllProblemSolvedByUser = async(req, res) => {

}