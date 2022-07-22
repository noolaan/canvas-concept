const CaseCard = require('./templates/CaseCard.js');

const twistedCard = new CaseCard({
    image: "twisted/twistedTea.png",
    productName: "Twisted Tea Half & Half",
    productType: "12 Pack Cans",
    productPrice: 15.49
});

twistedCard.build();
