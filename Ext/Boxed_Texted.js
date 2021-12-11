

(function(API){
    API.Boxed_Text = function(txt, x, y, width) {

        
        Debug = Debug || false;

        
        // Get current font size
        var fontSize = this.internal.getFontSize();
        txtWidth = this.getStringUnitWidth(txt)*fontSize/this.internal.scaleFactor;
        
        if(txtWidth > width)
        {
            txt = txt.split(" ");
            txt.forEach(element => {
                txtWidth = this.getStringUnitWidth(element)*fontSize/this.internal.scaleFactor;
                y += Boxed_Text_Draw(this,element, x, y, width, txtWidth)
            });
        }
        else
        {
            y += Boxed_Text_Draw(this,txt, x, y, width, txtWidth)
        }


        return y
    }
})(jsPDF.API);

function Boxed_Text_Draw(doc,txt, x, y, width, txtWidth)
{
    // Get page width
    var pageWidth = doc.internal.pageSize.width;

    // Get the actual text's width

    var h = doc.getTextDimensions(txt)["h"];
    if(Debug)
        doc.rect(x, y, width, h);
        
    // Calculate text's x coordinate
    x = x + ( width - txtWidth ) / 2;
    

    

    // Draw text at x,y
    doc.text(txt,x,y);
    return h
}