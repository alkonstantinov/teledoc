declare var $: any;
declare var dashboard: Dashboard;

class Dashboard extends BasePage {

    public LoadMeters() {
        var meters = Comm.POST("/dashboard", {});
        if (meters == null)
            return;

        $("#lregpatientscount").text(meters.regpatientscount);
        $("#lregdoctorscount").text(meters.regdoctorscount);
        $("#lregpharmacistscount").text(meters.regpharmacistscount);
        $("#lopenissuescount").text(meters.openissuescount);
        $("#ltakenissuescount").text(meters.takenissuescount);
        $("#lclosedissuesforweekcount").text(meters.closedissuesforweekcount);

    }
    

    constructor() {

        super();

    }

}


