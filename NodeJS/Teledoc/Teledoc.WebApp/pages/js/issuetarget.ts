declare var $: any;
declare var issuetarget: IssueTarget;

class IssueTarget extends BasePage {

    public Next() {
        if ($("#rbMe").prop("checked"))
            BasePage.Issue.WhoId = 1;
        else
            BasePage.Issue.WhoId = 2;
        if ($("#rbDoctor").prop("checked"))
            BasePage.Issue.ReqExpertLevelId = 2;
        else
            BasePage.Issue.ReqExpertLevelId = 3;
        

    }

    constructor() {

        super();
        
    }

}


