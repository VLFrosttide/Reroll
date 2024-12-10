let MyStr = `SaveIconName9e6310a4175089c52f68516d2d9249c0.jpgPositiveMods["sdgr","hb"]NegativeMods[]`;
MyStr = MyStr.replace("SaveIconName", "");
let IconName = MyStr.slice(0, MyStr.indexOf("PositiveMods"));
MyStr = MyStr.replace(IconName, "");

MyStr = MyStr.replace("PositiveMods", "");
let PositiveMods = MyStr.split("NegativeMods").shift();
let NegativeMods = MyStr.split("NegativeMods").pop();
