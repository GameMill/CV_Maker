






/*

$('#fileinput').on('change', function () {
    var fileReader = new FileReader();
    fileReader.onload = function () {
        try {
            var data = JSON.parse(fileReader.result);
            if(IsValid(data))
                LoadTemplate(data)
            else
                alert("Something went wrong. The file you are using is not a template file.")
        } catch (error) {
            console.log(error)
            alert("Something went wrong. It looks live the file your trying to load is not a json data file.")
        }
    };
    fileReader.readAsText($('#fileinput').prop('files')[0]);
});  
*/

function UpdateTemplate()
{
        $.getJSON( "/Templates/"+$('#Templates').find(":selected").attr("value")+".json", function( data ) {
            LoadTemplate(data)
        });
}

function ProgressBar(doc,x,y,width,height,BgColor,FgColor,progress)
{
    doc.setFillColor(BgColor[0],BgColor[1],BgColor[2])
    doc.rect(x,y,width,height,'F')
    doc.setFillColor(FgColor[0],FgColor[1],FgColor[2])
    doc.rect(x,y,width*(progress/100),height,'F')

}

$('#SaveFile').on('change', function () {
    var fileReader = new FileReader();
    fileReader.onload = function () {
        try {
            var data = JSON.parse(fileReader.result);
            console.log(data)

            if(IsValidData(data))
            {
                $("#Templates").val(data["Template"]);
                $("#Name").val(data["Name"])
                $("#JobTitle").val(data["JobTitle"])
                UpdateTemplate(data)
                $("#ContactsList tbody").html("")
                Object.keys(data["Contacts"]).forEach(element => {
                    addContact(element,data["Contacts"][element])
                });

                $("#Summary").val(data["Summary"])
                setTimeout(function(){ MakePage() },1000)
                

            }
            else
                alert("Something went wrong. The file you are using is not a template file.")
                
        } catch (error) {
            console.log(error)
            alert("Something went wrong. It looks live the file your trying to load is not a json data file.")
        }
    };
    fileReader.readAsText($('#SaveFile').prop('files')[0]);
});  
function newContact()
{
    addContact($("#ContactName").val(),$("#ContactValue").val())
    $("#ContactName").val("")
    $("#ContactValue").val("")
}
function addContact(name,value)
{
    if(name == "" || value == "")
        return;
    $('#ContactsList > tbody:last-child').append('<tr><td>'+name+'</td><td>'+value+'</td><td><button onclick="removeContact(this)">-</button></td></tr>');

}
function removeContact(dom)
{
    $(dom).parent().parent().remove()
}

function IsValid(data)
{
    if(data["Details"] == undefined)
        return false
    return true
}
function IsValidData(data)
{
    if(data["Template"] == undefined)
        return false
    return true
}


(function(API){
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