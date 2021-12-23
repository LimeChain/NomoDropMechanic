import hre from 'hardhat';
import fs from 'fs';

export async function verifyNFTAirdropMechanic(): Promise<void> {
    const [deployer] = await hre.ethers.getSigners();

    console.log('Verifying contracts with the account:', deployer.address);

    const contracts = JSON.parse(
        fs.readFileSync(`./contracts.json`, 'utf-8')
    );

    if (contracts.network != hre.network.name) {
        throw new Error(
            'Contracts are not deployed on the same network, that you are trying to verify!'
        );
    }

    //verify NFTAirdropMechanic contract
    try {
        await hre.run('verify:verify', {
            address: contracts.nftAirdropMechanic,
            constructorArguments: [
                contracts.erc721Address,
                contracts.tokensVault,
                contracts.vrfCoordinator,
                contracts.linkToken,
                contracts.keyhash,
                contracts.fee,
            ],
        });
    } catch (error: any) {
        logError('NFTAirdropMechanic', error.message);
    }

    console.log(`Account balance:  ${(await deployer.getBalance()).toString()} \n`);

}

function logError(contractName: string, msg: string) {
    console.log(
        `\x1b[31mError while trying to verify contract: ${contractName}!`
    );
    console.log(`Error message: ${msg}`);
    resetConsoleColor();
}

function resetConsoleColor() {
    console.log('\x1b[0m');
}

