class Renderer {
    constructor(TemplateData, YCol, Data) {
        this.TemplateData = TemplateData;
        this.YCol = YCol;
        this.Data = Data;
        this.doc = new jsPDF();

    }

    Render() {
        this.doc.title = this.Data["Name"] + " CV";
        document.title = this.doc.title;
        Object.keys(this.TemplateData).forEach(ColumnName => {
            var AreaData = this.TemplateData[ColumnName];

            AreaData.forEach(InnerData => {
                this.StringToFunction(InnerData["Function"], InnerData)
            });
        });


        return this.doc;
    }

    StringToFunction(string, Data) {
        var Y = 0;
        switch (string.toLowerCase()) {
            case "addfeatures":
                Y = this.AddFeature(Data["Data"]) || 0;
                break;
            case "addimage":
                Y = this.AddImage(Data) || 0;
                break;
            case "addtoycol":
                Y = this.AddToYCol(Data) || 0;
                break;
            case "text":
                Y = this.Text(Data) || 0;
                break;
            default:
                console.error("Function Not Defind: ", string)
                break;
        }
        this.AddCommon(Y, Data);
    }

    AddCommon(AddY, Data) {
        var AddToYCol = Data["AddToYCol"] || false;
        if(AddToYCol)
        {
            this.YCol[Data["YCol"]] += AddY;
        }
    }

    Text(Data) {
        this.setStyle(Data)
        var text = Data["Text"].replace(
            /{(\w*)}/g, // or /{(\w*)}/g for "{this} instead of %this%"
            (m, key) => {
                if (key in this.Data) {
                    return this.Data[key];
                }
                else if (key.includes("_")) {
                    var New_Key = key.split("_");
                    return this.getMultLayerKey(New_Key, this.Data);

                }
                else {
                    console.log("Key not found: ", key)
                    return "";
                }
            }
        );
        var Method = Data["Method"] || "Normal";
        Method = Method.toLowerCase();

        var X = Data["X"] || 0;
        var Y = this.GetY(Data)
        var Width = Data["Width"] || 0;
        var AddY = Data["AddToYCol"] || false;
        var _AddY = 0;
        if (Method == "normal") {
            var Align = Data["Align"] || "left";
            if (AddY) {
                this.doc.splitTextToSize(text, Width).forEach(element2 => {
                    _AddY += this.doc.getTextDimensions(element2)["h"] * 1.15;
                });
            }
            this.doc.text(text, X, Y, { align: Align, maxWidth: Width });
        }
        else if (Method == "boxcenter") {
            if (Data["ShowBox"] || false)
                this.AddFeature([
                    {
                        "Type": "Box",
                        "Color": [255, 0, 0],
                        "X": X,
                        "Y": Y,
                        "Width": Width,
                        "Height": -5
                    }
                ]);
            _AddY = this.doc.Boxed_Text(text, X, Y, Width);

        }
        return _AddY;
    }

    AddFeature(Data) {
        Data.forEach(FeatureData => {
            if (FeatureData["Type"] == "Box") {
                this.setStyle(FeatureData)
                var X = FeatureData["X"] || 0;
                var Y = FeatureData["Y"] || this.GetY(FeatureData);
                var Width = FeatureData["Width"] || 0;
                var Height = FeatureData["Height"] || 0;
                this.doc.rect(X, Y, Width, Height, 'F');
            }
        });
    }

    getMultLayerKey(keys, Data) {
        var key = keys.shift();
        if (key in Data) {
            var newData = Data[key];
            if (typeof newData === 'string' || newData instanceof String) {
                return newData;
            }
            else
                return this.getMultLayerKey(keys, newData);
        }
        else {
            console.log("Key not found: ", key, keys)
        }
    }

    GetY(Data) {
        var extra = Data["YOffset"] || 0
        return (this.YCol[Data["YCol"]] || 0) + extra
    }

    AddImage(Data) {

        var X = Data["X"] || 0;
        var Y = this.GetY(Data);
        var Width = Data["Width"] || 0;
        var Height = Data["Height"] || 0;
        var AddY = Data["AddY"] || false;

        this.doc.addImage(_Image["Data"], 'png', X, Y, Width, Height)
        if (AddY) {
            return Height;
        }
        return 0;
    }

    AddToYCol(Data) {
        if (Data["CopyFrom"]) 
        {
            var amount = this.YCol[Data["CopyFrom"]];

            if (typeof Data["YCol"] === 'string' || Data["YCol"] instanceof String) {
                if (Data["YCol"] == "All") {
                    Object.keys(this.YCol).forEach(YColName => {
                        this.YCol[YColName] = amount;
                    });
                }
                else {
                    this.YCol[Data["YCol"]] = amount;
                }
            }
            else {
                Data["YCol"].forEach(YColName => {
                    this.YCol[YColName] = amount;
                });
            }
        }
        else if (typeof Data["YCol"] === 'string' || Data["YCol"] instanceof String) {
            if (Data["YCol"] == "All") {
                Object.keys(this.YCol).forEach(YColName => {
                    this.YCol[YColName] += Data["Amount"];
                });
            }
            else {
                this.YCol[Data["YCol"]] += Data["Amount"];
            }
        } 
        else {
            
            Data["YCol"].forEach(YColName => {
                this.YCol[YColName] += Data["Amount"];
            });
        }

    }

    setStyle(style) {
        if (style["Color"] != undefined) {
            this.doc.setDrawColor(style["Color"][0], style["Color"][1], style["Color"][2]);
            this.doc.setFillColor(style["Color"][0], style["Color"][1], style["Color"][2]);
            this.doc.setTextColor(style["Color"][0], style["Color"][1], style["Color"][2]);
        }
        if (style["Font"] != undefined) {
            this.doc.setFont(style["Font"][0], style["Font"][1])
            this.doc.setFontSize(style["Font"][2]);
        }
    }
}