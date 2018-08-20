const DISALLOW_CHARS_PROJ_POPUL = ['{', '}', '$', '"', '\'', '[', ']', '(', ')'];

const PENN_CONST_TO_FN_MAPPING = {
  adjp: ['ADJ', 'A'],
};

const UD_TO_FN_MAPPING = {
  nsubj: {
    GF: 'Ext',
    PT: ['NP', 'Poss', 'PP', 'AVP', 'N', 'VPto'],
  },
  csubj: {
    GF: 'Ext',
    PT: ['Sfin', 'Sinterrog'],
  },
  // obj: [],
  // ccomp: [],
  // iobj: [],
  // xcomp: [],
};

/*
"NP",
"Poss",
"Sfin",
"PP",
"Sinterrog",
"AVP",
"N",
"VPto",
"VPing",
"VPfin",
"QUO",
"Sforto",
"A",
"Num",
"VPed",
"AJP",
"Swhether",
"Sun",
"Srel",
"VPbrst",
"Sing",
"Sub",
"PPinterrog",
"Sbrst",
"Sto",
"PPing",
"unknown"
*/

module.exports = {
  DISALLOW_CHARS_PROJ_POPUL,
  PENN_CONST_TO_FN_MAPPING,
  UD_TO_FN_MAPPING,
};
