#!/usr/bin/env node
/* Tex Password Generator
   This script generates secure passwords based on user-defined criteria.
*/
const crypto = require('node:crypto');
const { Command } = require('commander');

// Set up command line interface
const program = new Command();
program.version('1.0.0')
  .description('A secure password generator with various options for different purposes')
  .option('-l, --length <number>', 'password length', (val) => parseInt(val, 10), 16)
  .option('-p, --purpose <type>', 'password purpose: general, database, shell, url, xml, json, windows', 'general')
  .option('-e, --exclude <chars>', 'custom characters to exclude')
  .option('--no-lowercase', 'exclude lowercase letters')
  .option('--no-uppercase', 'exclude uppercase letters')
  .option('--no-numbers', 'exclude numbers')
  .option('--no-special', 'exclude special characters')
  .option('-c, --count <number>', 'number of passwords to generate', (val) => parseInt(val, 10), 1);

program.parse(process.argv);
const options = program.opts();

function generatePassword(options = {}) {
    // Get password length from options or use default
    const length = Math.max(8, options.length || 16);
    
    // Default character sets
    let specialChars = '-&$#*_!@%^+=[]{}|:;<>.?/~';
    const numbers = '0123456789';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Characters to exclude based on purpose
    if (options.purpose) {
        switch (options.purpose.toLowerCase()) {
            case 'database':
                // Avoid SQL and connection string special characters
                specialChars = specialChars.replace(/[%:*\\;@]/g, '');
                break;
            case 'shell':
                // Avoid shell special characters
                specialChars = specialChars.replace(/[$\/!\\~*?;|<>#]/g, '');
                break;
            case 'url':
                // Avoid URL encoding issues
                specialChars = specialChars.replace(/[&=+?\/;:#@]/g, '');
                break;
            case 'xml':
                // Avoid XML/HTML special characters
                specialChars = specialChars.replace(/[<>&]/g, '');
                break;
            case 'json':
                // Avoid JSON special characters
                specialChars = specialChars.replace(/[\\]/g, '');
                break;
            case 'windows':
                // Avoid Windows path special characters
                specialChars = specialChars.replace(/[\\/:*?<>|]/g, '');
                break;
        }
    }
    
    // Further exclude custom characters
    if (options.exclude) {
        for (const char of options.exclude) {
            specialChars = specialChars.replace(new RegExp(`\\${char}`, 'g'), '');
        }
    }
    
    // Prepare character pools based on options
    let charPools = [];
    let requiredChars = [];
    
    if (options.lowercase !== false) {
        charPools.push(lowercase);
        requiredChars.push(getRandomChar(lowercase));
    }
    
    if (options.uppercase !== false) {
        charPools.push(uppercase);
        requiredChars.push(getRandomChar(uppercase));
    }
    
    if (options.numbers !== false) {
        charPools.push(numbers);
        requiredChars.push(getRandomChar(numbers));
    }
    
    if (options.special !== false && specialChars.length > 0) {
        charPools.push(specialChars);
        requiredChars.push(getRandomChar(specialChars));
    }
    
    // If no character pools are selected, use lowercase as default
    if (charPools.length === 0) {
        charPools.push(lowercase);
        requiredChars = [getRandomChar(lowercase)];
        console.warn('Warning: All character types excluded. Using lowercase letters by default.');
    }
    
    function getRandomChar(characters) {
        const randomBytes = crypto.randomBytes(1);
        return characters[randomBytes[0] % characters.length];
    }
  
    function isValidPassword(password) {
        // Check if password contains at least one character from each required pool
        for (let i = 0; i < charPools.length; i++) {
            const pool = charPools[i];
            if (!new RegExp(`[${pool.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`).test(password)) {
                return false;
            }
        }
        return true;
    }
  
    function generateRandomPassword() {
        // Start with required characters from each pool
        let password = [...requiredChars];
        //console.log(`Required characters: ${password.join('')}`);
        // Fill the rest with random characters from all allowed pools
        const allChars = charPools.join('');
        const remainingLength = length - password.length;
  
        for (let i = 0; i < remainingLength; i++) {
            password.push(getRandomChar(allChars));
        }
  
        // Shuffle the password array using crypto-secure random
        for (let i = password.length - 1; i > 0; i--) {
            const j = crypto.randomBytes(4).readUInt32BE(0) % (i + 1);
            [password[i], password[j]] = [password[j], password[i]];
        }
  
        return password.join('');
    }
  
    // Generate passwords until we get one that meets all requirements
    let password;
    do {
        password = generateRandomPassword();
    } while (!isValidPassword(password));
  
    return password;
}

function main() {
    const count = options.count || 1;
    /*console.log(`Generating ${count} password(s) with the following options:`);
    console.log(`Length: ${options.length}`);
    console.log(`Purpose: ${options.purpose}`);
    console.log(`Exclude: ${options.exclude || 'none'}`);
    console.log(`Lowercase: ${options.lowercase !== false}`);
    console.log(`Uppercase: ${options.uppercase !== false}`);
    console.log(`Numbers: ${options.numbers !== false}`);
    console.log(`Special: ${options.special !== false}`);
    console.log(`Count: ${count}`);
    console.log('----------------------------------------');
    */
    // Generate and print the passwords
    for (let i = 0; i < count; i++) {
        const password = generatePassword(options);
        console.log(password);
    }
    
    // If generating multiple passwords, add helpful info
    if (count > 1) {
        console.log(`\nGenerated ${count} passwords for purpose: ${options.purpose}`);
        console.log(`Length: ${options.length} characters`);
    }
}

main();

