Loading = false;
function UpdateTemplate()
{
        $.getJSON( "./Templates/"+$('#Templates').find(":selected").attr("value")+".json", function( data ) {
            LoadTemplate(data);
        });
}

function ProgressBar(doc,x,y,width,height,BgColor,FgColor,progress)
{
    doc.setFillColor(BgColor[0],BgColor[1],BgColor[2]);
    doc.rect(x,y,width,height,'F');
    doc.setFillColor(FgColor[0],FgColor[1],FgColor[2]);
    doc.rect(x,y,width*(progress/100),height,'F');

}

$(':input').keyup(function(){
    if($(this).attr('noLiveEdit') != undefined)
        return;
    LiveEdit();
 });


function LiveEdit()
{
    if (document.getElementById('LiveEdit').checked && Loading == false)
    {
        MakePage();
    }
}
function LoadData(data) {
    try {
        Loading = true;
        if(IsValidData(data))
        {
            $("#Templates").val(data["Template"]);
            $("#Name").val(data["Name"]);
            $("#JobTitle").val(data["JobTitle"]);
            UpdateTemplate(data);
            
            ["Contact","Skill","Language"].forEach(element2 => {
                $("#"+element2+"sList tbody").html("");
                Object.keys(data[element2+"s"]).forEach(element => {
                    addToList(element2,element,data[element2+"s"][element])
                });
            });

            ["WorkHistory","Education","Certificate"].forEach(element2 => {
                $("#"+element2+"sList tbody").html("");

                data[element2].forEach(element => {
                    addToWorkList(element2,element["DateFrom"],element["DateTo"],element["Name"],element["Location"],element["Text"])
                });
                
            });


            $("#Summary").val(data["Summary"]);
            setTimeout(function(){ MakePage() },1000);
            
            Loading = false;
        }
        else
        {
            alert("Something went wrong. The file you are using is not a template file.");
        }
            
    } catch (error) {
        console.log(error);
        alert("Something went wrong. It looks live the file your trying to load is not a json data file.");
    };
}

$('#SaveFile').on('change', function () {
    var fileReader = new FileReader();
    fileReader.onload = function () {
        try {
            var data = JSON.parse(fileReader.result);
            loadData(data)
        } catch (error) {
            alert(error)
        }
    };
    fileReader.readAsText($('#SaveFile').prop('files')[0]);
});  

function addNewToList(name)
{
    addToList(name,$("#"+name+"Name").val(),$("#"+name+"Value").val());
    $("#"+name+"Name").val("");
    $("#"+name+"Value").val("");
    LiveEdit();
};

function addToList(domName,name,value)
{
    if(name == "" || value == "")
        return;
    $('#'+domName+'sList > tbody:last-child').append('<tr><td>'+name+'</td><td>'+value+'</td><td><button onclick="removeFromTable(this)">-</button></td></tr>');
};

function addToWorkList(domName, datefrom,dateto,name,location,text)
{
    if(datefrom == "" && dateto == "" && name == "" && location == "")
        return;
    if(datefrom == undefined)
        datefrom = "";
    if (dateto == undefined) 
        dateto = "";
    if(name == undefined)
        name = "";
    if(location == undefined)
        location = "";
    if(text == undefined)
        text = "";
    $('#'+domName+'sList > tbody:last-child').append('<tr><td>'+datefrom+'</td><td>'+dateto+'</td><td>'+name+'</td><td>'+location+'</td><td><textarea onclick="ShowLargeEditor(this)">'+text+'</textarea></td><td><button onclick="removeFromTable(this)">-</button></td></tr>');
};

function ProgressToNameConverter(precentage){
    if(precentage >= 75)
        return "Excellent";
    else if(precentage >= 75)
        return "Great";
    else if(precentage >= 65)
        return "Very Good";
    else if(precentage >= 50)
        return "Good";
    else if(precentage >= 25)
        return "Ok";
    else
        return "No Good";
};

function removeFromTable(dom)
{
    $(dom).parent().parent().remove();
    LiveEdit();
};

function IsValid(data)
{
    if(data["Details"] == undefined)
        return false;
    return true;
};
function IsValidData(data)
{
    if(data["Template"] == undefined)
        return false;
    return true;
};
TextAreaToModel = null;
function ShowLargeEditor(from)
{
    TextAreaToModel = from;
    $('#myModal textarea').val($(TextAreaToModel).val());
    $('#myModal').modal('show');
};
$('#myModal').on('hidden.bs.modal', function () {
    $(TextAreaToModel).val($('#myModal textarea').val());
    $('#myModal textarea').val("");
    LiveEdit();
});

function addWorkHistory(domName)
{
    from = $('#'+domName+'From').val();
    to = $('#'+domName+'To').val();
    _name = $('#'+domName+'Name').val();
    _location = $('#'+domName+'Location').val();
    addToWorkList(domName,from,to,_name,_location,"")
    $('#W'+domName+'From').val("");
    $('#'+domName+'To').val("");
    $('#'+domName+'Name').val("");
    $('#'+domName+'Location').val("");
}

(function(API){
    API.GetWidth = function(txt) {
        var fontSize = this.internal.getFontSize();
        return this.getStringUnitWidth(txt)*fontSize/this.internal.scaleFactor;
    }
    API.myText = function(txt, options, x, y) {
        options = options ||{};
        /* Use the options align property to specify desired text alignment
         * Param x will be ignored if desired text alignment is 'center'.
         * Usage of options can easily extend the function to apply different text 
         * styles and sizes 
        */
        if( options.align == "center" ){
            // Get current font size
            var fontSize = this.internal.getFontSize();

            // Get page width
            var pageWidth = this.internal.pageSize.width;

            // Get the actual text's width
            /* You multiply the unit width of your string by your font size and divide
             * by the internal scale factor. The division is necessary
             * for the case where you use units other than 'pt' in the constructor
             * of jsPDF.
            */
            txtWidth = this.getStringUnitWidth(txt)*fontSize/this.internal.scaleFactor;

            // Calculate text's x coordinate
            x = ( pageWidth - txtWidth ) / 2;
        }

        // Draw text at x,y
        this.text(txt,x,y);

    }
})(jsPDF.API);



UpdateTemplate()

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const WitchCV = urlParams.get('CV')
if (WitchCV != null) {
    $.get( "SavedCVs/"+WitchCV+".json", function( data ) {
        LoadData(data)
      });
}
