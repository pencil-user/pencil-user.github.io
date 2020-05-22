'use strict';
/*

Dušan Benašić

dbenasic|at|zoho|dot|com


f extra_init
f build_elements
f wrap_elements
f add_events
f remove_events
f error_msg

changed
starting_value
value
enabled
idprefix
idtarget
name
*/

let components = {};

function makeComponent(data,idprefix, action, $form)
{
    /// sets init_value. Most commonly it just makes init_value same as data.value

    if(!isString(data.id)) throw "No valid id given"

    if(!isString(data.type)) throw "No valid type given on "+data.id 

    let init_value = isDef(data.init_value) ? data.init_value : (isDef(data.value) ? data.value : "");

    let comp = 
    {
        __proto__   : component,

        id          : data.id,
        type        : data.type,
        $form       : $form,

        idprefix    : isString(idprefix)   ? idprefix : "", 
        label       : isString(data.label) ? data.label : "",
        value       : isDef(data.value)    ? data.value : null,
        init_value  : init_value,
        error       : isString(data.error) ? data.error : null,

        placeholder : isString(data.placeholder) ?  data.placeholder:"",
        required    : isBool(data.required) ? data.required : false,
        changed     : isBool(data.changed) ? data.changed : false,
        enabled     : isBool(data.enabled) ? data.enabled : true,

    }
    // add additional components
    for(let prop in component_types[data.type])
    {
        comp[prop] = component_types[data.type][prop]
    }
    
    if(isDef(comp.initExtra)) comp.initExtra(data,idprefix,action)

    return comp
}


let component =
{
    wrapElements: function($element, label_for)
    {
        let $label = (this.required) ? $("<div/>").text(this.label).append($("<span/>", {class: "form_required"}).text(" *") ) : $("<div/>").text(this.label)

        let props = isDef(label_for) ? {for:label_for} : {}

        this.wrapID = this.idprefix + "form_wraper_"+ this.id
        this.errorID = this.idprefix + "form_error_" + this.id

        return $("<div/>", {class:"form_warper form_border_init", id: this.wrapID}).append(
            $("<label/>", props).append( 
                $label,
                $("<div/>", {class:"form_error", id: this.errorID}).text( (isString(this.error) ) ? this.error : "")
            ),
            $element
        ) // div

    },

    submitValue: function()
    {
        this.removeErrorMsg()

        if(this.required && (this.value == "" || !isDef(this.value)))
        {
            this.errorMsg("This field is required")
            throw("EmptyField")
        }
        else
        {
            return this.value;
        }
    },

    errorMsg: function(msg)
    {
        this.error = msg
        $("#"+this.wrapID).removeClass("form_border_init form_border_changed")
        $("#"+this.wrapID).addClass(" form_border_error") 
        
        $("#" + this.errorID).text(msg)
    },

    removeErrorMsg: function()
    {
        this.error = ""
        $("#" + this.errorID).empty();
    },

    rebuildAll: function()
    {
        $("#"+this.wrapID).empty()

    },

    setValue: function(value)
    {   
        if(this.Value != value)
        {
            $("#"+this.elementID).val
            this.Value = value
        }
    },

    addEvents: function()
    {
        let self = this

        $("#"+this.elementID).on("change", function (e)
        {
            //self.fireEvent("change")
            self.value = this.value

            console.log(self.init_value)
            console.log(self.value)

            if(self.value != self.init_value)
            {

                $("#"+self.wrapID).removeClass("form_border_init form_border_error")
                $("#"+self.wrapID).addClass("form_border_changed")
                self.changed = true

            }
            else
            {
                $("#"+self.wrapID).removeClass("form_border_error form_border_changed")
                $("#"+self.wrapID).addClass("form_border_init")
                self.changed = false;
            }
        })


    },

    fireEvent: function(event, element)
    {

    },

    remove: function()
    {
        this.removed = true;
        this.$elem.empty();
    },



    buildElements : null,
    extraInit: null


}


let component_types =
{
    ///////
    /// text

    text:
    {
        buildElements: function ()
        {
            this.elementID = this.idprefix + this.id
            let $element = $("<input/>", {
                type: 'text',
                id: this.elementID,
                name: this.elementID,
                placeholder: this.placeholder,
                value: isDef(this.value) ? this.value : ""
            })

            this.$elem = this.wrapElements($element, this.elementID);

            this.$form.append(this.$elem)

            this.addEvents();

        }
    },

    number:
    {
        initExtra: function(data,idprefix, action, $form)
        {
            this.max = isDef(data.max)   ? data.max  :  1000
            this.min = isDef(data.min)   ? data.min  :  0
            this.step = isDef(data.step) ? data.step :  1

            if(this.init_value == "" || !isDef(this.init_value))
            {
                this.init_value = 0   
            }

        },

        buildElements: function ()
        {
            this.elementID = this.idprefix + this.id
            let $element = $("<input/>", {
                type: 'number',
                id: this.elementID,
                name: this.elementID,
                placeholder: this.placeholder,
                value: isDef(this.value) ? this.value : 0,
                max: this.max,
                min: this.min,
                step: this.step

            })

            this.$elem = this.wrapElements($element, this.elementID);

            this.$form.append(this.$elem)

            this.addEvents();

        }
    },


    ///////
    /// date   

    date:
    {
        buildElements: function ()
        {
            this.elementID = this.idprefix + this.id
            let $element = $("<input/>", {
                type: 'date',
                id: this.elementID,
                name: this.elementID,
                placeholder: this.placeholder,
                value: isDef(this.value) ? this.value : ""
            })

            this.$elem = this.wrapElements($element, this.elementID);

            this.$form.append(this.$elem)

            this.addEvents();

        }
    },

    ///////
    /// email 

    email:
    {
        buildElements: function ()
        {
            this.elementID = this.idprefix + this.id
            let $element = $("<input/>", {
                type: 'email',
                id: this.elementID,
                name: this.elementID,
                placeholder: this.placeholder,
                value: isDef(this.value) ? this.value : ""
            })

            $elem = this.wrapElements($element, this.elementID);

            this.$form.append($elem)

            this.addEvents();

        }
    },

    ///////
    /// password     

    password:
    {
        buildElements: function ()
        {
            this.elementID = this.idprefix + this.id
            let $element = $("<input/>", {
                type: 'password',
                id: this.elementID,
                placeholder: this.placeholder,
                name: this.elementID
            })

            this.$elem = this.wrapElements($element, this.elementID);

            this.$form.append(this.$elem)

            this.addEvents();

        }
    },

    /////////
    // textarea

    textarea:
    {
        initExtra: function(data,idprefix, action, place)
        {
            this.rows = isDef(data.rows) ? data.rows : "10"
            this.cols = isDef(data.cols) ? data.cols : "60"
        },

        buildElements: function ()
        {
            this.elementID = this.idprefix + this.id

            let $element = $("<textarea/>", {
                id: this.elementID,
                placeholder: this.placeholder,
                rows: this.rows,
                cols: this.cols,
                name: this.elementID
            }).text(("value" in this) ? this.value : "")

            this.$elem = this.wrapElements($element, this.elementID);

            this.$form.append(this.$elem)
            this.addEvents();

        }
    },

    //////////
    /// radio

    radio:
    {
        initExtra: function (data,idprefix, action, place)
        {
            if(isArray(data.options)) {this.options = data.options} else {throw "No valid option array given "+ data.id}
        },
        
        buildElements: function ()
        {
            let $elements = $("<div/>")
            let id = 0

            for(let o in this.options)
            {
                let option = this.options[o]
                
                let properties = {
                    type: "radio",
                    id: this.idprefix+this.id+"_"+id,
                    value: option.value,
                    name: this.idprefix+this.id,
                }
                
                if( ("selected" in option || "checked" in option) || this.value == option.value)
                {
                    properties.checked = "checked"
                }

                $elements.append(
                    $("<input/>", properties),
                    $("<label>", {for:this.idprefix+this.id+"_"+id}).text(option.label),
                    $("<br/>")
                )
                id++;
            }

            this.$elem = this.wrapElements($elements);

            this.$form.append(this.$elem)

            this.addEvents();
        },
    

        setValue: function(value)
        {   
            if(this.Value != value)
            {
                
                $('[name="'+this.idprefix+this.id+'"]').removeAttr('checked');
                $("input[name=mygroup][value=" + value + "]").prop('checked', true);
                this.Value = value

                for(let o in this.options)
                {
                    delete this.options[o].checked
                    delete this.options[o].selected
                    if(this.options[o].value == value)
                    {
                        this.options[o].checked = true
                        this.options[o].selected = true                        
                    }
                }

            }
        },

        addEvents: function()
        {
            let self = this

            for(let o in this.options)
            {
                let option = this.options[o]
                
                let ID = this.idprefix+this.id+"_"+o
                
                $("#"+ID).on("change", function (e)
                {
                    //self.fireEvent("change")
                    self.value = this.value
        
                    console.log(self.init_value)
                    if(self.value != self.init_value)
                    {
        
                        $("#"+self.wrapID).removeClass("form_border_init form_border_error")
                        $("#"+self.wrapID).addClass("form_border_changed")
                        self.changed = true
        
                    }
                    else
                    {
                        self.changed = false;
                        $("#"+self.wrapID).removeClass("form_border_error form_border_changed")
                        $("#"+self.wrapID).addClass("form_border_init")                
                    }
                })

            }
        }

    },

    ////////
    // Radio Database

    radio_database:
    {
        initExtra: function (data,idprefix, action, place)
        {
            if(isDef(data.resource) && isDef(data.resource_id) && isDef(data.resource_label))
            {
                this.options = [];
                this.resource = data.resource
                this.resource_id = data.resource_id
                this.resource_label = data.resource_label

            }
            else 
            {
                throw "No valid resource, resource_id or resource_label given "+ data.id
            }
        },

        buildElements: function ()
        {
            let $elements = $("<div/>", {id: this.idprefix+this.id+"option_list"})
            this.$elem = this.wrapElements($elements);
            this.$form.append(this.$elem)

            let self = this;

            $.ajax({
                url: rootURL+'?resource='+this.resource,
                type: 'GET',
                success: function(result) {
                    //$el = $("#" + self.idprefix+self.id+"option_list")

                    if(self.removed != true)
                    {
                        self.options = result
                        self.buildOptions(result)
                        
                    }
                    
                }
            })           
        },

        buildOptions: function (options)
        {
            let $elements = $("<div/>")
            let id = 0
            for(let o in options)
            {
                let option = options[o]
                
                let properties = {
                    type: "radio",
                    id: this.idprefix+this.id+"_"+id,
                    value: option[this.resource_id],
                    name: this.idprefix+this.id,
                }
                
                if( ("selected" in option || "checked" in option) || this.value == option[this.resource_id])
                {
                    properties.checked = "checked"
                }

                $elements.append(
                    $("<input/>", properties),
                    $("<label>", {for:this.idprefix+this.id+"_"+id}).text(option[this.resource_label]),
                    $("<br/>")
                )
                id++;
            }

            $("#"+ this.idprefix+this.id+"option_list").append($elements);

            this.addEvents();            
        },

        addEvents: function()
        {
            let self = this

            console.log("addEvents!!"+this.options.length)

            for(let id =0; id< this.options.length; id++)
            {
                let ID = this.idprefix+this.id+"_"+id

                console.log( this.idprefix+this.id+"_"+id)
                
                $("#"+ID).on("change", function (e)
                {
                    //self.fireEvent("change")
                    self.value = this.value
        
                    if(self.value != self.init_value)
                    {
                        $("#"+self.wrapID).removeClass("form_border_init form_border_error")
                        $("#"+self.wrapID).addClass("form_border_changed")
                        self.changed = true
                    }
                    else
                    {
                        $("#"+self.wrapID).removeClass("form_border_error form_border_changed")
                        $("#"+self.wrapID).addClass("form_border_init")
                        self.changed = false;                
                    }
                })

            }
    
        }
    },

    ////////
    // select

    select:
    {
        initExtra: function (data,idprefix, action, place)
        {
            if(isArray(data.options)) {this.options = data.options} else {throw "No valid option array given "+ data.id}  
        },

        buildElements: function ()
        {
            this.elementID = this.idprefix + this.id
            let $element = $("<select/>", {
                id: this.elementID,
                name: this.elementID,
            })

            for(let o in this.options)
            {
                let option = this.options[o]
                
                let properties = {
                    id: this.idprefix+this.id+"_"+o,
                    value: option.value,
                }

                if(("selected" in option || "checked" in option) || this.value == option.value)
                {
                    properties.selected = "selected"
                }

                $element.append( $("<option/>", properties).text(option.label) )
                
            }

            this.$elem = this.wrapElements($element, this.elementID);

            $form.append(this.$elem)

            this.addEvents();
        }, 

        setValue: function(value)
        {   
            if(this.Value != value)
            {
                
                $("#"+this.elementID).val(value)
                this.Value = value

                for(let option in this.options)
                {
                    delete this.options[option].checked
                    delete this.options[option].selected
                    if(this.options[option].value == value)
                    {
                        this.options[option].checked = true
                        this.options[option].selected = true                        
                    }
                }

            }
        }
    },

    //////////
    // file

    file:
    {
        initExtra: function (data,idprefix, action, place)
        {
            this.GUID = guidGenerator();
            this.file_sent = false;
            this.file_in_transit = false;
        },


        buildElements: function ()
        {
            this.elementID = this.idprefix + this.id
            let $element = $("<input/>", {
                type: 'file',
                id: this.elementID,
                name: this.elementID,
                placeholder: this.placeholder,
            })

            this.$elem = this.wrapElements($element, this.elementID);

            this.$form.append(this.$elem)

            this.addEvents();            
        },

        setValue: function ()
        {

        },

        submitValue: function()
        {
            this.removeErrorMsg()

            if(this.file_in_transit)
            {
                this.errorMsg("File is in transit, please wait")
                throw("EmptyField")
                
                return null;
            }

            if(this.file_sent)
            {
                return this.GUID
            }
    
            if(this.required && !this.file_sent)
            {
                if(this.file_in_transit)
                {
                    this.errorMsg("This field is required")
                    throw("EmptyField")
                }
            }

        },       


    }
}


function formController(data, rootElem,  idprefix)
{
    this.idprefix = idprefix;
    this.rootElem = rootElem;
    this.data = data;
    this.action = "";
    this.id = "";
    this.putValues = {};


    this.init = function(parameters)
    {
        this.components = {};

        if(parameters.action == "post")
        {
            console.log("form init, post")
            this.action = "post";
            this.putValues = {};
            this.render();
        }
        else
        {
            this.id = parameters.id
            this.action = "put";

            let self = this;
            $.ajax({
                url: rootURL+'?resource='+this.data.resource+'&id='+parameters.id,
                type: 'GET',
                success: function(result) {


                    self.putValues = result;

                    self.render()
                    
                }
            });            
        }

    }

    this.render = function()
    {
        this.$form = $('<form/>')

        this.$form.appendTo(this.rootElem)

        this.$form.append( $("<div/>", {class:"form_warper form_border_init", id: "form_warper_title"}).append($("<h3>").text(this.data.title)) )

        for(let e in data.elements)
        {
            this.components[this.data.elements[e].id] = makeComponent(this.data.elements[e], this.idprefix, this.action, this.$form)
        }
    
        for(let c in this.components)
        {
            if(this.action == "put" && isDef(this.putValues[c]))
            {
                this.components[c].value = this.putValues[c]
                this.components[c].init_value = this.putValues[c]

            }

            this.$form.append(this.components[c].buildElements())
        }
        
    
        this.$form.append(
            $("<div/>", {class:"form_warper form_border_init", id: "form_warper_submit"}).append(
                /*$("<input/>", {
                type: 'submit',
                id: 'submit',
                value: 'Submit'
                }),*/
                $("<button/>", {
                    type: 'button',
                    id: idprefix+'submit',
                    }).text("Submit"),
                
                $("<button/>", {
                        type: 'button',
                        id: idprefix+'cancel',
                        }).text("Cancel")
        ))

        let comp = this.components

        let self = this

        $("#"+idprefix+"submit").on("click", function (e){

            self.submit()
        })
    
        $("#"+idprefix+"cancel").on("click", function (e){
            self.remove()
            transition(self.came_from)
        })

    }

    this.submit = function()
    {
        let values = {}
        let ok = true

        let number_changed = 0

        for(let c in this.components)
        {
            //if(this.components[c].changed)
            //{
                number_changed++
                try
                {
                    values[c] = this.components[c].submitValue()
                }
                catch(err)
                {
                    ok = false
                    console.log("error!" + err)
                }
            //}
        } 

        console.log("for sending "+ number_changed + ok + " " + rootURL+'?resource='+this.data.resource+'&id='+this.id)
        console.log(values)

        if(ok && number_changed > 0)
        {
            let self = this
            if(this.action == "post")
            {
                console.log("POST POST POST")

                /*$.ajax({
                    url: rootURL+'?resource='+this.data.resource,
                    type: 'POST',
                    data: values,
                    success: function(result) {

                        console.log(result);
                        self.remove()
                        transition(self.came_from)                        
                        
                    }
                });  */
            }
            else
            {
               console.log("PUTPUTPUT")
                /*$.ajax({
                    url: rootURL+'?resource='+this.data.resource+'&id='+this.id,
                    type: 'PUT',
                    data: values,
                    success: function(result) {
                        
                        console.log(result)
                        self.remove()
                        transition(self.came_from)                        
                        
                    }
                }); */ 
            }
        }
    }

    this.remove = function()
    {
        for(let c in this.components)
        {
            this.components[c].remove()
        }   
        this.components = {}
        
        $(this.rootElem).empty()
    }


}
