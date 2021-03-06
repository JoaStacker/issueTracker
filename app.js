class Storage {
    static fetchIssuesStorage() {        
        if(localStorage.getItem("issues") !== null){
            let issues = JSON.parse(localStorage.getItem("issues"))
            console.log("Local data available")
            return issues
        }else{
            console.log("No local data")
            return []
        }
    }
    static saveIssuesStorage(newIssue){
        if(Array.isArray(newIssue)){
            localStorage.setItem("issues", JSON.stringify(newIssue))
        }else{
            if(localStorage.getItem("issues") === null){
                let issues = []
                issues.push(newIssue)
                localStorage.setItem('issues', JSON.stringify(issues))
            }else{
                let issues = JSON.parse(localStorage.getItem("issues"))
                issues.push(newIssue)
                localStorage.setItem("issues", JSON.stringify(issues))
            }
        }
    }
    static deleteStatus(id){
        if(!window.confirm("This item will be permanently removed. Do you want to continue?")){
            return null;
        }
        const issues = JSON.parse(localStorage.getItem("issues"))
        const filtered = issues.filter(element => element.id !== id)

        this.saveIssuesStorage(filtered)
        UI.insertIssuesDOM(this.fetchIssuesStorage());
    }
    static setStatusClosed(id){
        console.log("Set status closed triggered")
        const issues = JSON.parse(localStorage.getItem("issues"))
        issues.forEach(element => {
            
            if(element.id === id){
                element.status = element.status === 'Open' 
                                                ? element.status = 'Closed' 
                                                : element.status = 'Open'
            }
        })
        console.log(issues)

        this.saveIssuesStorage(issues)
        UI.insertIssuesDOM(this.fetchIssuesStorage());

    }
    static createIssue(){
        let issueId = chance.guid(); //random id generated by the chance library
        let issueDescription = document.querySelector("#issueDescInput").value
        let issueSeverity = document.querySelector("#issueSeverityInput").value
        let issueAssignedTo = document.querySelector("#issueAssignedToInput").value
        let issueStatus = 'Open'
    
        const newIssue = {
            id: issueId,
            description: issueDescription,
            severity: issueSeverity,
            assignedTo: issueAssignedTo,
            status: issueStatus
        }

        return newIssue
    }
    
}

class UI {
    setupApp(){
        document.querySelector(".submit-btn").addEventListener("click", ()=>{
            const issue = Storage.createIssue()
            Storage.saveIssuesStorage(issue)
            UI.insertIssuesDOM(Storage.fetchIssuesStorage())    
        })
        UI.insertIssuesDOM(Storage.fetchIssuesStorage())
    }
    static insertIssuesDOM(issues){
        document.querySelector("#issueInputForm").reset()
        let issuesList = document.querySelector("#issuesList")
        
        issuesList.innerHTML = ''

        issues.forEach(item => {
            let id = item.id 
            let desc = item.description
            let severity = item.severity
            let assignedTo = item.assignedTo
            let status = item.status
            console.log(status)
            issuesList.innerHTML += `<div class="well ${status}" id="${id}">
                                        <h6>Issue id: ${id}</h6>
                                        <p><span class="label label-info" id="error-state-${status}">${status}</span></p>
                                        <h3>${desc}</h3>
                                        <p><span class="glyphicon glyphicon-time">${severity}</span></p>
                                        <p><span class="glyphicon glyphicon-user">${assignedTo}</span></p>
                                        <a href="#" onclick="Storage.setStatusClosed('${id}')" class="btn btn-warning" id="btn-${status}">${status === 'Closed' ? 'Open' : 'Close'}</a>
                                        <a href="#" onclick="Storage.deleteStatus('${id}')" class="btn btn-danger">Delete</a>
                                    </div>`
        })
    }
    
}

window.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    ui.setupApp()
    
})