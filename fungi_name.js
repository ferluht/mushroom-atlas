function fungi_name(r) {

	var ks = Object.keys(fungi_vocab);
	t = ks[Math.floor(r() * ks.length)];
    name = '';
    spaces = 0;
    for (var i = 0; i < 15; i++) {
        name += t;
        if (!(t in fungi_vocab)) return ".";
        ind = fungi_vocab[t]['i'][Math.floor(fungi_vocab[t]['i'].length * r())];
        t = fungi_vocab[t]['t'][ind];
        if (t.indexOf('▁') > -1) {
            spaces += 1;
        }
        if (spaces > 1) {
            break;
        }
    }
    name = name.replaceAll('▁', ' ').trim();
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function get_valid_fungi_name(r) {
	name = ".";
	while (name.indexOf('.') > -1 || name.indexOf('/') > -1 || name.indexOf(' ') == -1 || name.length > 35 || name.charAt(0) == '-') {
		name = fungi_name(r);
	}
	return name;
}