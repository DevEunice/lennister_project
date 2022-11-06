const Fees = require('../model/feeConfigurationSpecModel');
const result = {}


const feeConfiguration = async(req,res)=>{
    try {
        const {FeeConfigurationSpec} = req.body;
        const newFsc = FeeConfigurationSpec.split("\n");
        const nextFsc = newFsc.map(fs => fs.split(" "))

        const newData = nextFsc.map(el=>{
            const obj = {};
            obj["feeId"] = el[0];
            obj["feeCurrency"] = el[1];
            obj["feeLocal"] = el[2];
            obj["feeEntity"] = el[3].split("(")[0];
            obj["entityProperty"] = el[3].split("(")[1].slice(0, -1);
            obj["feeType"] = el[6];
            obj["feeValue"] = el[7];
            return obj
        })
        

        // console.log(newData);
        const fsc = await Fees.bulkCreate(newData);

        // const Fee = await Fees.create()
        res.status(200).json({
            status: "ok"
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            status: "failed"
        })
    }
}


const feeComputation = async (req, res)=>{
    try {
        const amount = req.body.Amount;
        const currency = req.body.Currency;
        const currencyCountry = req.body.CurrencyCountry;
        const bearsFee = req.body.Customer.BearsFee;
        const issuer = req.body.PaymentEntity.Issuer;
        const brand = req.body.PaymentEntity.Brand;
        const number = req.body.PaymentEntity.Number;
        const sixID = req.body.PaymentEntity.SixID;
        const type = req.body.PaymentEntity.Type;
        const country = req.body.PaymentEntity.Country;

        const allFeeSpec = await Fees.findAll();

        if(currency !== "NGN" ){
            return res.status(400).json({
                "Error": "No fee configuration for USD transactions."
              })
        }
        
        

        const local = currencyCountry == country? "LOCL" : "INTL"
        const applicableFSC = allFeeSpec.filter(el=>{
            if(local === el.feeLocal || el.feeLocal === "*"){
                if(el.feeEntity === type || el.feeEntity === "*"){                  
                    if (el.entityProperty === number) {
                        return el
                    }else if(el.entityProperty === sixID){
                        return el
                    }else if(el.entityProperty === brand){
                        return el
                    }else if(el.entityProperty === issuer){
                        return el
                    }else if(el.entityProperty === "*" && el.feeEntity === type){
                        return el
                    }             
                }
            }
        })

        const lessFsc = allFeeSpec.filter(el=>{
            if(local === el.feeLocal || el.feeLocal === "*"){
                if(el.feeEntity === type || el.feeEntity === "*"){                  
                    if (el.entityProperty === "*" && el.feeEntity === "*") {
                        return el
                    }            
                }
            }
        })

        console.log(lessFsc)

        

        
        function appliedFee(fscArr, amount, bears){
            // console.log(bears);
            let total;
            
            if(fscArr.feeType === "PERC"){
                
                total = (fscArr.feeValue/100) * amount 
                console.log(total, "PERC")
                return total
            }else if(fscArr.feeType === "FLAT"){
                total = fscArr.feeValue
                console.log(total, "FLAT")
                return total
            }else if(fscArr.feeType === "FLAT_PERC"){
                let flat = Number(fscArr.feeValue.split(":")[0])
                let perc = Number(fscArr.feeValue.split(":")[1])
                total = flat + (perc/100) * amount
                console.log(total, "FLAT_PERC")
                
                return total
            }
            
        }

    //   appliedFee(applicableFSC[0],amount, bearsFee)

        if(applicableFSC.length > 0){
            
            
            result["AppliedFeeID"] = applicableFSC[0].feeId;
            result["AppliedFeeValue"] = Math.round(appliedFee(applicableFSC[0],amount, bearsFee));
            result["ChargeAmount"] = bearsFee? result.AppliedFeeValue + amount: amount
            result["SettlementAmount"] = result.ChargeAmount - result.AppliedFeeValue ;
        
            return res.status(200).json({
                result
            })
        
        }else if(lessFsc.length > 0){
            result["AppliedFeeID"] = lessFsc[0].feeId;
            result["AppliedFeeValue"] = Math.round(appliedFee(lessFsc[0],amount, bearsFee));
            result["ChargeAmount"] = bearsFee? result.AppliedFeeValue + amount: amount
            result["SettlementAmount"] = result.ChargeAmount - result.AppliedFeeValue ;
        
            return res.status(200).json({
                result
            })
        }
        else{
            return res.status(400).json({
                Error: "No fee configuration for this transaction"
            })
        }
    
   

        res.status(200).json({
            status: "fee computation"
        })
    } catch (error) {
        res.status(400).json({
            status: "failed"
        })
    }
}

module.exports = {
    feeConfiguration,
    feeComputation
}

