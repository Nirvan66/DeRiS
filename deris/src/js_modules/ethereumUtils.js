import web3 from 'web3';

/**
 * Wrapper function for web3 ethereum address checker
 * 
 * @param {string} address address to check
 * 
 * @returns {boolean} true if is valid address false otherwise
 */
function isValidAddress(address) {
    address = (typeof(address) === 'string' || address instanceof String) ? address : address.toString();
    return web3.utils.isAddress(address);
}

export  {
    isValidAddress
}