const DISALLOW_CHARS_PROJ_POPUL = ['{', '}', '$', '"', '\'', '[', ']', '(', ')'];

const PENN_CONST_TO_FN_MAPPING = {
  adjp: ['ADJ', 'A'],
};

const UD_TO_FN_MAPPING = {
  nsubj: {
    GF: 'Ext',
    PT: ['NP', 'Poss', 'AJP', 'AVP'],
  },
  csubj: {
    GF: 'Ext',
    PT: ['Sfin', 'Sinterrog', 'Swhether', 'Sing', 'Srel', 'Sto', 'Sforto', 'Sbrst', 'Sub'],
  },
  obj: {
    GF: 'Obj',
    PT: ['NP', 'Poss', 'AJP', 'AVP'],
  },
  ccomp: {
    GF: 'Obj',
    PT: ['Sfin', 'Sinterrog', 'Swhether', 'Sing', 'Srel', 'Sto', 'Sforto', 'Sbrst', 'Sub'],
  },
  iobj: {
    GF: 'Dep',
    PT: ['NP', 'Poss', 'AJP', 'AVP'],
  },
  xcomp: {
    GF: 'Dep',
    PT: ['Sfin', 'Sinterrog', 'Swhether', 'Sing', 'Srel', 'Sto', 'Sforto', 'Sbrst', 'Sub'],
  },
};

module.exports = {
  DISALLOW_CHARS_PROJ_POPUL,
  PENN_CONST_TO_FN_MAPPING,
  UD_TO_FN_MAPPING,
};
