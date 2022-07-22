const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

class Template {

    constructor(opts = {}) {

        this.type = opts.type; //caseCard, static, etc.

        this.width = parseInt(opts.width);
        this.height = parseInt(opts.height);
        this.padding = parseInt(opts.padding) || 50;

        this.canvas = createCanvas(this.width, this.height, 'pdf');
        this.ctx = this.canvas.getContext('2d');

    }

    save() {

        const directory = path.join(process.cwd(), 'output', this.type);
        if(!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
            console.log(`Created output directory: "${directory}"`);
        }

        fs.writeFile(path.join(directory, 'output.pdf'), this.canvas.toBuffer(), (error) => {
            if(error) return console.error(error);
            console.log("Created output PDF");
        });

    }

    _showCenter() {
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(this.width/2, 0);
        this.ctx.lineTo(this.width/2, this.height);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height/2);
        this.ctx.lineTo(this.width, this.height/2);
        this.ctx.stroke();
    }

    _showPadding() {
        this.ctx.lineWidth = 10;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.padding);
        this.ctx.lineTo(this.width, this.padding);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height-this.padding);
        this.ctx.lineTo(this.width, this.height-this.padding);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.padding, 0);
        this.ctx.lineTo(this.padding, this.height);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.width-this.padding, 0);
        this.ctx.lineTo(this.width-this.padding, this.height);
        this.ctx.stroke();
    }


}

module.exports = Template;
