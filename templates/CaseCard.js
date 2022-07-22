const { Image } = require('canvas');
const Template = require('../interfaces/Template.js');
const path = require('path');
const Util = require('../Util.js');
const fs = require('fs');

class CaseCard extends Template {

    constructor(opts = {}) {

        // this is on a "high resolution" 300dpi printer (300 pixels/inch)

        super({
            type: 'caseCard',
            width: 2550, //standard 8.5" x 11" paper
            height: 3300,
            padding: 150 //1" padding
        });

        this.image = path.join(process.cwd(), 'resources', opts.image);        // twisted/twistedTea.png
        this.productName = opts.productName || "Product Name";                 // Twisted Tea Original
        this.productType = opts.productType || "Product Type";                 // 2/12 Cans
        this.productPrice = parseFloat(opts.productPrice).toFixed(2) || 12.99; // $12.99

    }

    async build() {

        if(!fs.existsSync(this.image)) return new Error(`Image with directory "${this.image}" does not exist.`);
        
        const imageDimensions = await Util.imageDimensions(this.image);
        if(!imageDimensions) return new Error("Had issues grabbing image dimensions.");

        //Debug
        this._showCenter();
        this._showPadding();

        //Image Handling
        const image = new Image();
        image.src = this.image;

        const scaledWidth = this.width-(this.padding*2);
        const ratio = Math.min(scaledWidth/imageDimensions.width, this.height/imageDimensions.height);
        this.ctx.drawImage(image, this.padding, this.padding, imageDimensions.width*ratio, imageDimensions.height*ratio)

        const below = (imageDimensions.height*ratio)+this.padding; //at the end of the image

        //Product Price

        this.ctx.fillStyle = "rgb(255, 185, 0)";
        this.ctx.strokeStyle = "rgb(10, 41, 109)";
        this.ctx.lineWidth = 25;


        const [ dollar, rightText ] = this.productPrice.toString().split("."); // [ 12, 99 ];
        const leftText = `$${dollar}`;

        const { size, difference } = await this._findCombinedFontSize(leftText, rightText);

        this.ctx.font = `${size}px Impact`;
        this.ctx.textAlign = "right";
        const leftMeasure = this.ctx.measureText(leftText);
        this.ctx.fillText(leftText, (this.width/2)+(difference/2), (this.height-this.padding)-size/200, this.scaledWidth);
        this.ctx.strokeText(leftText, (this.width/2)+(difference/2), (this.height-this.padding)-size/200, this.scaledWidth);

        this.ctx.font = `${size/2}px Impact`;
        this.ctx.textAlign = "left";
        const rightMeasure = this.ctx.measureText(rightText);
        this.ctx.fillText(rightText, (this.width/2)+(difference/2), this.height-this.padding-rightMeasure.actualBoundingBoxAscent, this.scaledWidth);
        this.ctx.strokeText(rightText, (this.width/2)+(difference/2), this.height-this.padding-rightMeasure.actualBoundingBoxAscent, this.scaledWidth);


        this.ctx.fillStyle = "rgb(10, 41, 109)";

        //Product Type
        const typePosition = this.height-this.padding-leftMeasure.actualBoundingBoxAscent-80; //80px gap between text
        const typeSize = await this._findFontSize(this.productType, scaledWidth);
        this.ctx.font = `${typeSize}px Impact`;
        this.ctx.textAlign = "center";
        const typeMeasure = this.ctx.measureText(this.productType);
        this.ctx.fillText(this.productType, this.width/2, typePosition, scaledWidth);
        // this.ctx.strokeText(this.productType, this.width/2, typePosition, scaledWidth);

        //Product Name
        const namePosition = typePosition-typeMeasure.actualBoundingBoxAscent-80; //80px gap between text
        const nameSize = await this._findFontSize(this.productName, scaledWidth);
        this.ctx.font = `${nameSize}px Impact`;
        this.ctx.textAlign = "center";
        // const nameMeasure = this.ctx.measureText(this.productName);
        // const nameTextSize = nameMeasure.actualBoundingBoxAscent+nameMeasure.actualBoundingBoxDescent;
        this.ctx.fillText(this.productName, this.width/2, namePosition, scaledWidth);
        // this.ctx.strokeText(this.productName, this.width/2, namePosition, scaledWidth);


        //Save to PDF
        this.save();

    }

    _findCombinedFontSize(text1, text2) {
        return new Promise((resolve, reject) => {
            const findFontSize = (size) => {
                this.ctx.font = `${size}px Impact`;
                const leftMeasure = this.ctx.measureText(text1);
                this.ctx.font = `${size/2}px Impact`;
                const rightMeasure = this.ctx.measureText(text2);
                const totalSize = leftMeasure.width+rightMeasure.width;
                const difference = leftMeasure.width-rightMeasure.width;
                if(totalSize < (this.width-(this.padding*2))) findFontSize(size+10);
                else return resolve({ size, difference });
            };
            return findFontSize(200);
        });
    }

    _findFontSize(text, maxWidth) {
        return new Promise((resolve, reject) => {
            const getWidth = (size) => {
                this.ctx.font = `${size}px Impact`;
                let measure = this.ctx.measureText(text);
                if(measure.width < maxWidth) getWidth(size+10);
                else return resolve(size);
            };
            return getWidth(200);
        });
    }


    /*

    async build() {

        const imageDimensions = await Util.imageDimensions(this.image);
        if(!imageDimensions) return undefined;

        const image = new Image()
        image.src = imagePath;

        const hRatio = this.height/imageDimensions.height;
        const wRatio = this.width/imageDimensions.width;
        const ratio = Math.min(hRatio, wRatio);
        const centerShiftX = (this.width - imageDimensions.width*ratio)/2;
        const sizeDifference = this.padding*2;

        this.ctx.drawImage(image, 0, 0, imageDimensions.width, imageDimensions.height,
            centerShiftX+this.padding, this.padding, (imageDimensions.width*ratio)-sizeDifference, (imageDimensions.height*ratio)-this.padding);

        // loadImage(path.join(process.cwd(), 'resources/twisted/twistedTea.png')).then((image) => {
        //     this.ctx.drawImage(image, 50, 0, 70, 70)
        // }).catch((error) => {
        //     console.error(error);
        // });

        this.ctx.font = '300px Impact'
        this.ctx.measureText('Twisted Tea Original 2/12');
        this.ctx.fillText('Twisted Tea Original 2/12', this.padding, this.padding+imageDimensions.height, this.width-(this.padding*2))

        this.save();

    }

    */

}

module.exports = CaseCard;