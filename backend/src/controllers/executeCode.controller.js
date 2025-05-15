import { getJudge0LanguageId, getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.libs.js"
import { db } from "../libs/db.js"

export const executeCode = async(req, res) => {
    try {
        const {source_code, language_id, stdin, expected_output, problemId} = req.body

        const userId = req.user.id

        //validate 
        if(
            !Array.isArray(stdin) ||
            stdin.length === 0 ||
            !Array.isArray(expected_output) || 
            expected_output.length !== stdin.length
        ){
            return res.status(400).json({error : "Invalid or Missing TestCases"})
        }

        //2. prepare each testcases  or judge0 batch submission
        const submission = stdin.map((input) => ({
           source_code,
           language_id,
           stdin: input,
        }))
        //3. send the batch of submission to judge zero
        const submitResponse = await submitBatch(submission)

        const tokens = submitResponse.map((res)=> res.token)

        //4. Pool the judge0 for all submitted test cases
        const results = await pollBatchResults(tokens)

        console.log('Result ------')
        console.log(results)

        // Analyze testcases

        let allPassed = true;
        const detailedResults = results.map((result, i)=> {
            const stdout = result.stdout?.trim()
            const expectedOutput = expected_output[i]?.trim()

            const passed = stdout === expectedOutput

            if(!passed) allPassed = false

            return {
                testCase: i+1,
                passed,
                stdout,
                expected:expectedOutput,
                stderr: result.stderr || null,
                compiledOutput : result.compile_output || null,
                status: result.status.description,
                memory: result.memory ? `${result.memory} KB` : undefined,
                time: result.time ? `${result.time} s` : undefined
            }

            //!Just to check
            // console.log(`testcase #${i+1}`)
            // console.log(`input ${stdin[i]}`)
            // console.log(`Expected output for the testcase ${expectedOutput}`)
            // console.log(`Actual output received by execution of code in J0 ${stdout}`)
            // console.log(`Matched: ${passed}\n`)

            
        })
        console.log(`Detailed Results --------`)
        console.log(detailedResults)

        //store submission summary in db
        const submission_in_db = await db.submission.create({
            data: {
                userId,
                problemId,
                sourceCode : source_code,
                language: getLanguageName(language_id),
                stdin: stdin.join("\n"),
                stdout: detailedResults.map((r) => r.stdout) ? JSON.stringify(detailedResults.map((r) => r.stdout)) : null,
                stderr: detailedResults.some((r) => r.stderr) ? JSON.stringify(detailedResults.some((r) => r.stderr)) : null,
                status : allPassed ? "Accepted" : "Wrong Answer",
                time: detailedResults.some((r) => r.time) ? JSON.stringify(detailedResults.map((r) => r.time)) : null,
                memory: detailedResults.some((r) => r.memory) ? JSON.stringify(detailedResults.map((r) => r.memory)) : null,
                compileOutput: detailedResults.some((r) => r.compile_output) ? JSON.stringify(detailedResults.map((r) => r.compile_output)) : null,
            }
        })

        //?checking for submission
        console.log('submission made in db ---------')
        console.log(submission_in_db)

        //if all allpased ==== true, marked problem done by user

        if(allPassed){
            await db.ProblemSolved.upsert({
                where: {
                    userId_problemId: {
                        userId, problemId
                    }
                },
                update: {},
                create:{
                    userId, problemId
                }
            })
        }


        // save individual testcases
        const testCaseResults = detailedResults.map((result) => ({
            submissionId : submission_in_db.id, //!be very carefull here as the submisson in sir's code is submission_in_db for me
            testCase: result.testCase,
            passed : result.passed,
            stdout : result.stdout,
            expected: result.expected,
            stderr : result.stderr,
            compiledOutput : result.compile_output,
            status : result.status,
            memory : result.memory,
            time : result.time,
        }))
        //! may cause error here
        await db.TestCaseResult.createMany({
            data : testCaseResults
        })

        const submissionWithTestCase = await db.submission.findUnique({
            where : {
                id: submission_in_db.id
            },
            include:{
                testCases:true
            }
        })

        res.status(200).json({
            success: true,
            message : "code executed successfully!",
            submission: submissionWithTestCase
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'error creating problem'
        })

    }
}