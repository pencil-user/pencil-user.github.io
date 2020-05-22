/*
Dušan Benašić

dbenasic|at|zoho|dot|com
*/

function tableController(data, rootElem,  idprefix, action)
{

    this.selectedIDs = [];
    this.madeIDs = [];
    this.idprefix = idprefix;
    this.rootElem = rootElem;
    this.data = data;
        

    this.init = function (parameters)
    {
        this.$upperNumbers = $('<div />', {id:this.idprefix+"upper_numbers"})

        this.$table = $('<table />', {id:this.idprefix+"table", class:"form_warper form_border_init"})

        this.$lowerNumbers = $('<div />', {id:this.idprefix+"lower_numbers"})

        this.$lowerButtons = $('<div />', {id:this.idprefix+"lower_buttons", class:"form_warper form_border_init"})

        let $tr = $("<tr />") 
        $tr.appendTo(this.$table)

        for(let h in this.data.headers)
        {
            $('<th />').text(this.data.headers[h]).appendTo($tr) ;
        }

        if("approve" in this.data.actions)
        {
            $('<th />').text("approve").appendTo($tr)
        }

        if("put" in this.data.actions)
        {
            $('<th />').text("edit").appendTo($tr)
        }
    
        if("delete" in this.data.actions)
        {
            $('<th />').text("delete").appendTo($tr)
        }

        if("post" in this.data.actions)
        {
            this.$lowerCreate = $('<button>').text("Add New")
            this.$lowerButtons.append(this.$lowerCreate)
        }

       $("<div/>", {class:"form_warper form_border_init", id: "form_warper_title"}).append($("<h3>").text(this.data.title)).appendTo(this.rootElem)

        this.$upperNumbers.appendTo(this.rootElem);
        this.$table.appendTo(this.rootElem);
        this.$lowerNumbers.appendTo(this.rootElem);
        this.$lowerButtons.appendTo(this.rootElem);

        let self = this
        this.$table.click(
            function (e)
            {
                let row_action = $(e.target).data("row_action")
                let row_id = $(e.target).data("row_id")
                
                switch(row_action)
                {
                    case "put":
                        transition(self.data.actions.put.page, {id: row_id, action:"put"})
                    break;
                    case "delete":

                        let self_ = self

                        $.ajax({
                            url: rootURL+'?resource=' + self_.data.actions.delete.resource + "&id="+row_id,
                            type: 'DELETE',
                            success: function(result) {
                                self_.loadRows();
                                
                            }
                        });   

                    break;
                }

            }

        )
 
        this.$upperNumbers.click(
            function (e)
            {
                console.log(e);
            }
        )

        this.$lowerNumbers.click(
            function (e)
            {
                console.log(e);
            }

        )

        if("post" in this.data.actions)
        {
            this.$lowerCreate.click(
                function (e)
                {
                    console.log("hello " + self.data.actions.post.page)
                    transition(self.data.actions.post.page,{action:"post"})
                }
            )
        }

        this.loadRows();
    }

    this.loadRows = function()
    {
        let self = this
        $.ajax({
            url: rootURL+'?resource=' + this.data.resource,
            type: 'GET',
            success: function(result) {
                console.log("ajax rows")
                self.makeRows(result);
                
            }
        });        
    }

    this.makeRows = function(rows)
    {
        this.removeRows();
        for(let r in rows)
        {
            let id = rows[r][this.data.resource_id];
            this.madeIDs.push(id);
            $tr = $('<tr />', {id:this.idprefix + "row_"+id});

            for(let h in this.data.headers)
            {
                //let header = this.data.headers[h]

                let cell = rows[r][h]
                let $td = $('<td />', {id:this.idprefix + "row_"+id+"_"+h});

                $td.text(cell);
                $td.appendTo($tr);

            }

            /*
            for(let c in rows[r])
            {
                let cell = rows[r][c];
                let $td = $('<td />', {id:this.idprefix + "row_"+id+"_"+c});

                $td.text(cell);
                $td.appendTo($tr);
            }*/

            if("approve" in this.data.actions)
            {
                let $approve = $('<td />').append($('<a />',{href:"#", class:"row_action_link"}).text("approve").data("row_action", "approve").data("row_id", id) )
                $approve.appendTo($tr)
            }
    
            if("put" in this.data.actions)
            {
                let $put = $('<td />').append($('<a />',{href:"#", class:"row_action_link"}).text("edit").data("row_action", "put").data("row_id", id) )
                $put.appendTo($tr)
            }

            if("delete" in this.data.actions)
            {
                let $delete = $('<td />').append($('<a />',{href:"#", class:"row_action_link"}).text("delete").data("row_action", "delete").data("row_id", id) )
                $delete.appendTo($tr)
            }

            $tr.appendTo(this.$table)    
        }
    }

    this.makeNumbers = function (curret, max)
    {

    }

    this.removeRows = function ()
    {
        for(let i in this.madeIDs)
        { 
            $( "#"+this.idprefix+"row_"+this.madeIDs[i] ).remove();
        }
        this.madeIDs = [];     
    }

    this.removeNumbers = function ()
    {
        this.$upperNumbers.empty()
        this.$lowerNumbers.empty()
    }

    this.removeButtons = function ()
    {
        this.$lowerButtons.empty()
    }

    this.clickPageNo= function(page)
    {

    }

    this.clickEdit = function(resource)
    {
        console.log(resource)
    }

    this.clickDelete = function(resource)
    {
        console.log(resource)
    }

    this.clickAdd = function(resource)
    {

    }

    this.remove = function ()
    {
        //this.removeRows();

        this.removeNumbers();
        this.$table.empty()
        $(this.rootElem).empty()
    }

}