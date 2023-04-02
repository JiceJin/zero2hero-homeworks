const hre = require("hardhat");

async function main(){
    const [first,second] = await hre.ethers.getSigners();
    const logic1 = await hre.ethers.getContractAt("logic1","0x5fbdb2315678afecb367f032d93f642f64180aa3");
    const logic2 = await hre.ethers.getContractAt("logic2","0xe7f1725e7734ce288f8367e1bb143e90bb3f0512");
    const proxy = await hre.ethers.getContractAt("Proxy","0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0");
    
    console.log(await proxy._logic());

    let tx = await proxy.delecall_upgrade("0x0900f0100000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa3");
    //0x0900f010000000000000000000000000e7f1725e7734ce288f8367e1bb143e90bb3f0512
    //0x0900f0100000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa3
    let recipient = await tx.wait();

    console.log(await proxy._logic());
    console.log("=============================");
    console.log(recipient);
    

}

main().catch((error)=>{
    console.log(error);
    process.exitCode = 1;
});