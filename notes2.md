## Notes for leetcode-2 class

**notes**- use sulu judge0 api

**Endpoints for problem route**
- /create problem
- /get-all problem
- /get-problem/:id
- /update-problem/:id
- /delete-problem/:id
- /get-soleved-problem

### steps
app.use('', problemRoute) -->  problme.routes.js

#### create problem logic
- going to get all the data from the request body
- going to check user roles once again 
- reference solution(stored as object)
    - python
    - java 
    - c++
- loop through every language
    - get languge id from judge0