var _excluded = ["uniqueId"],
  _excluded2 = ["uniqueId"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import GameLogic from './logic.js';
import { SETTINGS_STORAGE_KEY, loadAndApplySettings, saveSettingsToStorage } from './settingsValidation.js';

// --- Game Logic Constants ---
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var {
  t,
  getLoc,
  EVENTS,
  ERAS,
  IDEOLOGIES,
  ALL_CARDS,
  MISSIONS,
  DIFFICULTY_SETTINGS,
  INFLATION_MIN,
  INFLATION_MAX,
  getRatingByDebt,
  getRatingInfo,
  clampInflation,
  applyInflationDrift,
  applyInflationChange,
  MAX_STANDARD_CARD_ID,
  getPotentialActions,
  getGameStatus,
  evaluateGame,
  resolveBondRisk,
  secureRandom,
  calculateInflatedCost
} = GameLogic;

// --- Mocks ---
var SoundManager = {
  init: () => {},
  isMuted: false,
  setMuted(value) {
    this.isMuted = Boolean(value);
  },
  setVolume: () => {},
  toggleMute() {
    this.setMuted(!this.isMuted);
  },
  playTone: () => {},
  playClick: () => {},
  playError: () => {},
  playCoin: () => {},
  playSuccess: () => {},
  playCard: () => {},
  playGameEnd: () => {},
  playCrisis: () => {},
  playDoom: () => {}
};

// --- Icons ---
var IconZap = _ref => {
  var {
    size = 24,
    className = ""
  } = _ref;
  return /*#__PURE__*/_jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    children: /*#__PURE__*/_jsx("polygon", {
      points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
    })
  });
};
var IconShield = _ref2 => {
  var {
    size = 24,
    className = ""
  } = _ref2;
  return /*#__PURE__*/_jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    children: /*#__PURE__*/_jsx("path", {
      d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    })
  });
};
var IconAlertCircle = _ref3 => {
  var {
    size = 24,
    className = ""
  } = _ref3;
  return /*#__PURE__*/_jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    children: [/*#__PURE__*/_jsx("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/_jsx("line", {
      x1: "12",
      y1: "8",
      x2: "12",
      y2: "12"
    }), /*#__PURE__*/_jsx("line", {
      x1: "12",
      y1: "16",
      x2: "12.01",
      y2: "16"
    })]
  });
};
var IconBookOpen = _ref4 => {
  var {
    size = 24,
    className = ""
  } = _ref4;
  return /*#__PURE__*/_jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    children: [/*#__PURE__*/_jsx("path", {
      d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
    }), /*#__PURE__*/_jsx("path", {
      d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
    })]
  });
};
var IconVolume2 = _ref5 => {
  var {
    size = 24,
    className = ""
  } = _ref5;
  return /*#__PURE__*/_jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    children: [/*#__PURE__*/_jsx("polygon", {
      points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
    }), /*#__PURE__*/_jsx("path", {
      d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
    })]
  });
};
var IconVolumeX = _ref6 => {
  var {
    size = 24,
    className = ""
  } = _ref6;
  return /*#__PURE__*/_jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    children: [/*#__PURE__*/_jsx("polygon", {
      points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5"
    }), /*#__PURE__*/_jsx("line", {
      x1: "23",
      y1: "9",
      x2: "17",
      y2: "15"
    }), /*#__PURE__*/_jsx("line", {
      x1: "17",
      y1: "9",
      x2: "23",
      y2: "15"
    })]
  });
};
var IconX = _ref7 => {
  var {
    size = 24,
    className = ""
  } = _ref7;
  return /*#__PURE__*/_jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    children: [/*#__PURE__*/_jsx("line", {
      x1: "18",
      y1: "6",
      x2: "6",
      y2: "18"
    }), /*#__PURE__*/_jsx("line", {
      x1: "6",
      y1: "6",
      x2: "18",
      y2: "18"
    })]
  });
};
var IconSettings = _ref8 => {
  var {
    size = 24,
    className = ""
  } = _ref8;
  return /*#__PURE__*/_jsxs("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    children: [/*#__PURE__*/_jsx("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/_jsx("path", {
      d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
    })]
  });
};
var IconStar = _ref9 => {
  var {
    size = 24,
    className = ""
  } = _ref9;
  return /*#__PURE__*/_jsx("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className,
    children: /*#__PURE__*/_jsx("polygon", {
      points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
    })
  });
};

// --- Config (UI) ---
var CARD_TYPES = {
  PRODUCTION: {
    label: '生産',
    label_en: 'PROD',
    baseStyle: 'bg-slate-800 border-cyan-800 hover:border-cyan-400 hover:shadow-cyan-500/20 text-cyan-100',
    headerStyle: 'bg-cyan-950/50 text-cyan-400 border-b border-cyan-900',
    icon: /*#__PURE__*/_jsx(IconZap, {
      size: 14,
      className: "text-cyan-400"
    })
  },
  POLICY: {
    label: '政策',
    label_en: 'POLICY',
    baseStyle: 'bg-slate-800 border-emerald-800 hover:border-emerald-400 hover:shadow-emerald-500/20 text-emerald-100',
    headerStyle: 'bg-emerald-950/50 text-emerald-400 border-b border-emerald-900',
    icon: /*#__PURE__*/_jsx(IconBookOpen, {
      size: 14,
      className: "text-emerald-400"
    })
  },
  ATTACK: {
    label: '外交',
    label_en: 'DIPLO',
    baseStyle: 'bg-slate-800 border-rose-800 hover:border-rose-400 hover:shadow-rose-500/20 text-rose-100',
    headerStyle: 'bg-rose-950/50 text-rose-400 border-b border-rose-900',
    icon: /*#__PURE__*/_jsx(IconShield, {
      size: 14,
      className: "text-rose-400"
    })
  }
};

// --- Visual Components ---
var BackgroundEffects = () => /*#__PURE__*/_jsx("div", {}); // Stub for tests
var Confetti = () => /*#__PURE__*/_jsx("div", {}); // Stub for tests

var ComboOverlay = _ref0 => {
  var {
    message,
    show
  } = _ref0;
  if (!show) return null;
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 z-[80] flex items-center justify-center pointer-events-none animate-fade-in",
    children: /*#__PURE__*/_jsx("div", {
      className: "text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-amber-600 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-pop-in",
      children: message
    })
  });
};
var NumberCounter = _ref1 => {
  var {
    value
  } = _ref1;
  return /*#__PURE__*/_jsx("span", {
    children: value
  });
}; // Simplified for tests

var TurnOverlay = _ref10 => {
  var {
    turn,
    show
  } = _ref10;
  if (!show) return null;
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 z-[60] flex items-center justify-center pointer-events-none",
    children: /*#__PURE__*/_jsxs("div", {
      className: "bg-slate-900/90 text-cyan-400 text-6xl font-black px-12 py-6 rounded-2xl border-4 border-cyan-500 shadow-[0_0_50px_rgba(6,182,212,0.5)] animate-pop-in",
      children: ["TURN ", turn]
    })
  });
};
var CrisisOverlay = _ref11 => {
  var {
    message,
    show,
    type = 'danger'
  } = _ref11;
  if (!show) return null;
  var color = type === 'danger' ? 'text-red-500 border-red-600 bg-red-950/90' : 'text-amber-500 border-amber-600 bg-amber-950/90';
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 z-[110] flex items-center justify-center pointer-events-none",
    children: /*#__PURE__*/_jsxs("div", {
      className: "px-12 py-8 rounded-xl border-4 shadow-2xl animate-pop-in flex flex-col items-center ".concat(color),
      children: [/*#__PURE__*/_jsx(IconAlertCircle, {
        size: 64,
        className: "mb-4 animate-bounce"
      }), /*#__PURE__*/_jsx("h2", {
        className: "text-5xl font-black tracking-tighter uppercase mb-2 text-center whitespace-pre-wrap",
        children: message
      }), /*#__PURE__*/_jsx("p", {
        className: "text-xl font-bold opacity-80 uppercase tracking-widest",
        children: "EMERGENCY ALERT"
      })]
    })
  });
};
var TurnSummaryPanel = _ref12 => {
  var {
    data,
    onContinue,
    lang
  } = _ref12;
  if (!data) return null;
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in",
    children: /*#__PURE__*/_jsxs("div", {
      className: "bg-slate-800 border-2 border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center relative overflow-hidden animate-pop-in",
      children: [/*#__PURE__*/_jsxs("h2", {
        className: "text-2xl font-black text-white mb-6 tracking-tighter",
        children: [t('turnSummary', lang).toUpperCase(), " ", data.turn]
      }), /*#__PURE__*/_jsx("button", {
        onClick: onContinue,
        children: t('continue', lang)
      })]
    })
  });
};
var CardInfoPanel = _ref13 => {
  var _typeInfo$headerStyle;
  var {
    card,
    lang
  } = _ref13;
  if (!card) return null;
  var typeInfo = CARD_TYPES[card.type];
  return /*#__PURE__*/_jsxs("div", {
    className: "bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden animate-fade-in shadow-lg",
    children: [/*#__PURE__*/_jsxs("div", {
      className: "px-4 py-3 border-b border-slate-800 flex items-center gap-2 ".concat(typeInfo === null || typeInfo === void 0 || (_typeInfo$headerStyle = typeInfo.headerStyle) === null || _typeInfo$headerStyle === void 0 ? void 0 : _typeInfo$headerStyle.replace('bg-', 'bg-opacity-20 bg-')),
      children: [typeInfo === null || typeInfo === void 0 ? void 0 : typeInfo.icon, /*#__PURE__*/_jsx("span", {
        className: "font-bold text-sm tracking-wider",
        children: getLoc(card, 'name', lang)
      })]
    }), /*#__PURE__*/_jsx("div", {
      className: "p-4 space-y-4",
      children: /*#__PURE__*/_jsx("p", {
        className: "text-xs text-slate-400 leading-relaxed",
        children: getLoc(card, 'description', lang)
      })
    })]
  });
};
var MissionStatusContent = _ref14 => {
  var {
    activeMission,
    player,
    lang
  } = _ref14;
  if (!activeMission) {
    return /*#__PURE__*/_jsx("p", {
      "data-testid": "mission-status-empty",
      children: lang === 'en' ? 'No active mission' : '進行中ミッションなし'
    });
  }
  var isObjectiveMet = activeMission.objective(player);
  var missionName = getLoc(activeMission, 'name', lang);
  var objectiveText = getLoc(activeMission, 'objective_text', lang);
  return /*#__PURE__*/_jsxs("div", {
    "data-testid": "mission-status-active",
    children: [/*#__PURE__*/_jsx("div", {
      "data-testid": "mission-name",
      children: missionName
    }), /*#__PURE__*/_jsxs("div", {
      "data-testid": "mission-turns",
      children: [lang === 'en' ? 'Turns left' : '残りターン', ": ", activeMission.turnsRemaining]
    }), /*#__PURE__*/_jsx("div", {
      "data-testid": "mission-objective",
      children: objectiveText
    }), /*#__PURE__*/_jsxs("div", {
      "data-testid": "mission-progress",
      children: [lang === 'en' ? 'Achievable now' : '現在達成可能', ": ", isObjectiveMet ? '✅' : '❌']
    })]
  });
};
var IdeologyMissionPanel = _ref15 => {
  var {
    activeMission,
    player,
    lang
  } = _ref15;
  return /*#__PURE__*/_jsxs("div", {
    "data-testid": "ideology-mission-panel",
    children: [/*#__PURE__*/_jsx("h4", {
      children: t('ideologyMission', lang)
    }), /*#__PURE__*/_jsx(MissionStatusContent, {
      activeMission: activeMission,
      player: player,
      lang: lang
    })]
  });
};
var MissionPanel = _ref16 => {
  var {
    activeMission,
    player,
    completedMissionCount,
    lang
  } = _ref16;
  return /*#__PURE__*/_jsxs("div", {
    "data-testid": "mission-panel",
    children: [/*#__PURE__*/_jsx("h4", {
      children: lang === 'en' ? 'Mission' : 'ミッション'
    }), /*#__PURE__*/_jsxs("div", {
      "data-testid": "completed-mission-count",
      children: [lang === 'en' ? 'Completed' : '達成数', ": ", completedMissionCount]
    }), /*#__PURE__*/_jsx(MissionStatusContent, {
      activeMission: activeMission,
      player: player,
      lang: lang
    })]
  });
};
var FONT_SIZE_OPTIONS = ['small', 'medium', 'large'];
var SettingsModal = _ref17 => {
  var {
    isOpen,
    onClose,
    settings,
    onChange: _onChange
  } = _ref17;
  if (!isOpen) return null;
  return /*#__PURE__*/_jsx("div", {
    className: "fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4",
    "data-testid": "settings-modal",
    children: /*#__PURE__*/_jsxs("div", {
      className: "w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex items-center justify-between",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "text-lg font-bold",
          children: "Settings"
        }), /*#__PURE__*/_jsx("button", {
          onClick: onClose,
          "aria-label": "Close settings",
          children: /*#__PURE__*/_jsx(IconX, {
            size: 18
          })
        })]
      }), /*#__PURE__*/_jsxs("label", {
        className: "block",
        children: ["Language", /*#__PURE__*/_jsxs("select", {
          value: settings.lang,
          onChange: event => _onChange('lang', event.target.value),
          "data-testid": "settings-lang",
          children: [/*#__PURE__*/_jsx("option", {
            value: "ja",
            children: "\u65E5\u672C\u8A9E"
          }), /*#__PURE__*/_jsx("option", {
            value: "en",
            children: "English"
          })]
        })]
      }), /*#__PURE__*/_jsxs("label", {
        className: "block",
        children: ["Font size", /*#__PURE__*/_jsx("select", {
          value: settings.fontSizeLevel,
          onChange: event => _onChange('fontSizeLevel', event.target.value),
          "data-testid": "settings-font-size",
          children: FONT_SIZE_OPTIONS.map(option => /*#__PURE__*/_jsx("option", {
            value: option,
            children: option
          }, option))
        })]
      }), /*#__PURE__*/_jsxs("label", {
        className: "block",
        children: ["Master volume: ", settings.masterVolume, /*#__PURE__*/_jsx("input", {
          type: "range",
          min: 0,
          max: 100,
          value: settings.masterVolume,
          onChange: event => _onChange('masterVolume', Number(event.target.value)),
          "data-testid": "settings-master-volume"
        })]
      }), /*#__PURE__*/_jsxs("label", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsx("input", {
          type: "checkbox",
          checked: settings.skipTurnSummary,
          onChange: event => _onChange('skipTurnSummary', event.target.checked),
          "data-testid": "settings-skip-summary"
        }), "Skip turn summary"]
      }), /*#__PURE__*/_jsxs("label", {
        className: "flex items-center gap-2",
        children: [/*#__PURE__*/_jsx("input", {
          type: "checkbox",
          checked: settings.isMuted,
          onChange: event => _onChange('isMuted', event.target.checked),
          "data-testid": "settings-muted"
        }), "Mute audio"]
      })]
    })
  });
};
var StatusPanel = _ref18 => {
  var _data$inflation;
  var {
    data,
    isEnemy
  } = _ref18;
  if (!data) return /*#__PURE__*/_jsx("div", {
    className: "p-4 border rounded text-red-500",
    children: "Error: No Data"
  });
  return /*#__PURE__*/_jsxs("div", {
    className: "relative overflow-hidden p-6 rounded-3xl border transition-all duration-300",
    children: [/*#__PURE__*/_jsxs("div", {
      "data-testid": isEnemy ? 'enemy-gdp' : 'player-gdp',
      children: ["GDP: ", /*#__PURE__*/_jsx(NumberCounter, {
        value: data.gdp
      })]
    }), /*#__PURE__*/_jsxs("div", {
      "data-testid": isEnemy ? 'enemy-money' : 'player-money',
      children: ["\xA5", /*#__PURE__*/_jsx(NumberCounter, {
        value: data.money
      })]
    }), /*#__PURE__*/_jsxs("div", {
      "data-testid": isEnemy ? 'enemy-debt' : 'player-debt',
      children: ["Debt: ", /*#__PURE__*/_jsx(NumberCounter, {
        value: data.debt
      })]
    }), /*#__PURE__*/_jsxs("div", {
      "data-testid": isEnemy ? 'enemy-inflation' : 'player-inflation',
      children: ["Inflation: ", (_data$inflation = data.inflation) === null || _data$inflation === void 0 ? void 0 : _data$inflation.toFixed(1), "%"]
    }), /*#__PURE__*/_jsxs("div", {
      "data-testid": isEnemy ? 'enemy-support' : 'player-support',
      children: ["Support: ", /*#__PURE__*/_jsx(NumberCounter, {
        value: data.support
      })]
    })]
  });
};

// Pure Helpers extracted for performance
var getCardProvidedTags = card => {
  var tags = [];
  if (Array.isArray(card === null || card === void 0 ? void 0 : card.providesTags)) {
    tags.push(...card.providesTags);
  }
  if (card !== null && card !== void 0 && card.providesTag) {
    tags.push(card.providesTag);
  }
  return tags;
};
var calculateSuccessRate = (card, support) => {
  var _card$baseSuccessRate;
  var base = (_card$baseSuccessRate = card.baseSuccessRate) !== null && _card$baseSuccessRate !== void 0 ? _card$baseSuccessRate : 100;
  if (base >= 100) return 100;
  var bonus = (support - 50) * 0.5;
  return Math.min(100, Math.max(0, Math.round(base + bonus)));
};
var CardButton = /*#__PURE__*/memo(_ref19 => {
  var {
    card,
    onPlay,
    player,
    gameState,
    lang,
    activeEvent,
    era
  } = _ref19;
  var typeInfo = CARD_TYPES[card.type];
  var typeLabel = lang === 'en' ? typeInfo.label_en : typeInfo.label;
  var inflatedCost = calculateInflatedCost(card.cost, player.inflation, activeEvent, era);
  return /*#__PURE__*/_jsxs("button", {
    onClick: () => onPlay(card),
    disabled: gameState !== 'PLAYING',
    "data-testid": "card-".concat(getLoc(card, 'name', lang)),
    className: "card-button ".concat(typeInfo.baseStyle),
    children: [/*#__PURE__*/_jsxs("div", {
      className: "px-3 py-2 flex justify-between items-center ".concat(typeInfo.headerStyle),
      children: [/*#__PURE__*/_jsxs("span", {
        className: "text-[10px] font-black uppercase tracking-wider flex items-center gap-1",
        children: [typeInfo.icon, " ", typeLabel]
      }), /*#__PURE__*/_jsxs("span", {
        className: "font-mono text-lg font-black tracking-tighter",
        children: ["\xA5", inflatedCost]
      })]
    }), /*#__PURE__*/_jsx("h4", {
      className: "font-bold text-slate-200 text-sm mb-1.5 min-h-[2.5em] flex items-center leading-snug",
      children: getLoc(card, 'name', lang)
    })]
  });
});
function EconomicCardGame(_ref20) {
  var _small$medium$large$f;
  var {
    initialDeck = null,
    randomFn = secureRandom,
    initialEvent = null
  } = _ref20;
  var rng = typeof randomFn === 'function' ? randomFn : secureRandom;
  var randomInt = max => Math.floor(rng() * max);
  var createRandomId = () => randomInt(Number.MAX_SAFE_INTEGER);
  var missionProcessedTurnRef = useRef(0);
  var [turn, setTurn] = useState(1);
  var [era] = useState(ERAS.GROWTH);
  var [gameState, setGameState] = useState('TITLE'); // TITLE, SETUP, PLAYING, WON, LOST
  var [skipTurnSummary, setSkipTurnSummary] = useState(false);
  var [autoProceed, setAutoProceed] = useState(false);
  var [logs, setLogs] = useState([]);
  var [activeEvent, setActiveEvent] = useState(null);
  var [lastTags, setLastTags] = useState([]);
  var [isMuted, setIsMuted] = useState(false);
  var [evaluation, setEvaluation] = useState(null);
  var [lang, setLang] = useState('ja');
  var [activeMission, setActiveMission] = useState(null);
  var [completedMissionCount, setCompletedMissionCount] = useState(0);
  var [turnSummaryData, setTurnSummaryData] = useState(null);
  var [showTurnSummary, setShowTurnSummary] = useState(false);
  var [turnHighlight, setTurnHighlight] = useState({
    gdpGain: 0,
    text: ''
  });
  var [unlockedAchievements] = useState({});
  var [fontSizeLevel, setFontSizeLevel] = useState('medium');
  var [masterVolume, setMasterVolume] = useState(50);
  var [showSettings, setShowSettings] = useState(false);

  // Mock localStorage for tests if needed (useEffect handles it)

  // Difficulty State
  var [selectedDifficulty, setSelectedDifficulty] = useState(DIFFICULTY_SETTINGS.NORMAL.id);
  var [currentDifficulty, setCurrentDifficulty] = useState(DIFFICULTY_SETTINGS.NORMAL);
  var [selectedIdeology, setSelectedIdeology] = useState(IDEOLOGIES.KEYNESIAN.id);
  var [gameDeck, setGameDeck] = useState([]);
  var [discardPile, setDiscardPile] = useState([]);
  var [bondIssuedThisTurn, setBondIssuedThisTurn] = useState(false);
  var shuffleArray = arr => {
    var copy = [...arr];
    for (var i = copy.length - 1; i > 0; i--) {
      var j = randomInt(i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    loadAndApplySettings({
      setLang,
      setFontSizeLevel,
      setSkipTurnSummary,
      setIsMuted,
      setMasterVolume
    }, localStorage, SETTINGS_STORAGE_KEY);
  }, []);
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    saveSettingsToStorage(localStorage, {
      lang,
      fontSizeLevel,
      skipTurnSummary,
      isMuted,
      masterVolume
    }, SETTINGS_STORAGE_KEY);
  }, [lang, fontSizeLevel, skipTurnSummary, isMuted, masterVolume]);
  useEffect(() => {
    SoundManager.setMuted(isMuted);
    SoundManager.setVolume(masterVolume / 100);
  }, [isMuted, masterVolume]);
  useEffect(() => {
    if (autoProceed) {
      setAutoProceed(false);
      proceedToNextTurn();
    }
  }, [autoProceed]);
  var [player, setPlayer] = useState({
    name: 'あなた',
    money: 100,
    income: 10,
    gdp: 0,
    inflation: 0,
    support: 70,
    debt: 0,
    rating: 'AAA',
    interestDue: 0
  });
  var [playerHand, setPlayerHand] = useState([]);
  var [enemy, setEnemy] = useState({
    name: 'ライバル国',
    money: 100,
    income: 10,
    gdp: 0,
    inflation: 0,
    support: 70,
    debt: 0,
    rating: 'AAA',
    interestDue: 0
  });
  var applyUnrestPenalty = state => {
    if (!state) return state;
    if (state.inflation < 8) return state;
    var incomePenalty = state.inflation >= 12 ? 4 : 2;
    var gdpPenalty = state.inflation >= 10 ? 5 : 0;
    return _objectSpread(_objectSpread({}, state), {}, {
      income: Math.max(0, state.income - incomePenalty),
      gdp: Math.max(0, state.gdp - gdpPenalty)
    });
  };
  var applySupportChange = function applySupportChange(state) {
    var _state$support;
    var delta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (!delta) return state;
    var prevSupport = (_state$support = state.support) !== null && _state$support !== void 0 ? _state$support : 0;
    var nextSupport = Math.min(100, Math.max(0, prevSupport + delta));
    return _objectSpread(_objectSpread({}, state), {}, {
      support: nextSupport
    });
  };
  var applyRatingUpdate = state => {
    var _state$debt;
    var nextRating = getRatingByDebt((_state$debt = state.debt) !== null && _state$debt !== void 0 ? _state$debt : 0);
    return _objectSpread(_objectSpread({}, state), {}, {
      rating: nextRating
    });
  };
  var getInterestForTurn = state => {
    var _state$interestDue;
    var ratingInfo = getRatingInfo(state.rating);
    return Math.max(0, Math.round(((_state$interestDue = state.interestDue) !== null && _state$interestDue !== void 0 ? _state$interestDue : 0) * ratingInfo.interestMultiplier));
  };
  var applyInterestPayment = state => {
    var interest = getInterestForTurn(state);
    if (!interest) return state;
    return _objectSpread(_objectSpread({}, state), {}, {
      money: Math.max(0, state.money - interest)
    });
  };
  var pickInitialEvent = () => {
    if (typeof initialEvent === 'number' && Number.isInteger(initialEvent)) {
      var _EVENTS$initialEvent;
      return (_EVENTS$initialEvent = EVENTS[initialEvent]) !== null && _EVENTS$initialEvent !== void 0 ? _EVENTS$initialEvent : null;
    }
    if (initialEvent) {
      return initialEvent;
    }
    if (EVENTS.length === 0) return null;
    return EVENTS[randomInt(EVENTS.length)];
  };
  var startGame = () => {
    var difficulty = DIFFICULTY_SETTINGS[selectedDifficulty];
    setCurrentDifficulty(difficulty);
    var ideology = IDEOLOGIES[selectedIdeology];
    var shuffledDeck;
    if (initialDeck) {
      shuffledDeck = shuffleArray([...initialDeck]);
    } else {
      var deckSource = ALL_CARDS;
      var availableCards = deckSource.filter(card => !card.requiredAchievement || unlockedAchievements[card.requiredAchievement]);
      var newDeck = [];
      availableCards.forEach(card => {
        var weight = ideology.deckWeights[card.id] || 1;
        for (var i = 0; i < weight; i++) newDeck.push(card);
      });
      shuffledDeck = shuffleArray(newDeck);
    }
    setGameDeck(shuffledDeck);
    setDiscardPile([]);
    var event = pickInitialEvent();
    setActiveEvent(event);
    var initialDebt = (ideology.initialStats.debt || 0) + (difficulty.initialDebt || 0);
    var initialPlayerState = {
      money: (ideology.initialStats.money || 100) + (difficulty.initialMoney - DIFFICULTY_SETTINGS.NORMAL.initialMoney),
      income: 20,
      gdp: 0,
      inflation: 0,
      support: ideology.initialStats.support || 70,
      debt: initialDebt,
      rating: getRatingByDebt(initialDebt),
      interestDue: Math.round(initialDebt * 0.1),
      activeEffects: []
    };
    var initialEnemyState = {
      money: difficulty.initialMoney,
      income: 20,
      gdp: 0,
      inflation: 0,
      support: 70,
      debt: difficulty.initialDebt,
      rating: getRatingByDebt(difficulty.initialDebt),
      interestDue: Math.round(difficulty.initialDebt * 0.1),
      activeEffects: []
    };
    setPlayer(initialPlayerState);
    setEnemy(_objectSpread(_objectSpread({}, initialEnemyState), {}, {
      name: 'ライバル国',
      activeEffects: []
    }));
    setPlayerHand([]);
    setLastTags([]);
    setTurn(1);
    setGameState('PLAYING');
    setActiveMission(null);
    setCompletedMissionCount(0);
    setBondIssuedThisTurn(false);
    missionProcessedTurnRef.current = 0;
    drawCards(3, shuffledDeck, []);
  };
  var addLog = useCallback(msg => {
    setLogs(prev => [{
      id: createRandomId(),
      message: msg
    }, ...prev].slice(0, 10));
  }, [randomFn]);
  var drawCards = function drawCards(count) {
    var sourceDeck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var sourceDiscard = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var deck = sourceDeck ? [...sourceDeck] : [...gameDeck];
    var discarded = sourceDiscard ? [...sourceDiscard] : [...discardPile];
    var drawnCards = [];
    for (var i = 0; i < count; i++) {
      if (deck.length === 0) {
        if (discarded.length === 0) break;
        deck = shuffleArray(discarded);
        discarded = [];
      }
      var [card] = deck.splice(-1, 1);
      drawnCards.push(_objectSpread(_objectSpread({}, card), {}, {
        uniqueId: createRandomId()
      }));
    }
    if (drawnCards.length > 0) {
      setPlayerHand(prev => [...prev, ...drawnCards]);
    }
    setGameDeck(deck);
    setDiscardPile(discarded);
  };
  var issueBonds = () => {
    if (gameState !== 'PLAYING') return;
    if (bondIssuedThisTurn) return;
    setPlayer(prev => {
      var _prev$debt, _prev$interestDue;
      var updated = _objectSpread(_objectSpread({}, prev), {}, {
        money: prev.money + 50,
        debt: ((_prev$debt = prev.debt) !== null && _prev$debt !== void 0 ? _prev$debt : 0) + 50,
        interestDue: ((_prev$interestDue = prev.interestDue) !== null && _prev$interestDue !== void 0 ? _prev$interestDue : 0) + 5
      });
      return applyRatingUpdate(updated, 'あなた');
    });
    setBondIssuedThisTurn(true);
    addLog(lang === 'en' ? 'Issued bonds: Funds +50, Debt +50, Interest +5' : '国債発行: 資金+50、債務+50、利払+5');
  };
  var repayDebt = () => {
    if (gameState !== 'PLAYING') return;
    if (player.money < 50) return;
    if ((player.debt || 0) <= 0) return;
    setPlayer(prev => {
      var _prev$debt2, _prev$interestDue2;
      var updated = _objectSpread(_objectSpread({}, prev), {}, {
        money: prev.money - 50,
        debt: Math.max(0, ((_prev$debt2 = prev.debt) !== null && _prev$debt2 !== void 0 ? _prev$debt2 : 0) - 50),
        interestDue: Math.max(0, ((_prev$interestDue2 = prev.interestDue) !== null && _prev$interestDue2 !== void 0 ? _prev$interestDue2 : 0) - 5)
      });
      return applyRatingUpdate(updated, 'あなた');
    });
  };
  var applyEventMultiplier = (prevState, nextState) => {
    var _activeEvent$effect;
    var evtMultiplier = (activeEvent === null || activeEvent === void 0 || (_activeEvent$effect = activeEvent.effect) === null || _activeEvent$effect === void 0 ? void 0 : _activeEvent$effect.effectMultiplier) || 1;
    var difficultyMult = currentDifficulty.eventDamageMultiplier || 1;
    var applyScale = key => {
      var delta = nextState[key] - prevState[key];
      var scaledDelta = Math.round(delta * evtMultiplier);
      if (scaledDelta < 0) scaledDelta = Math.round(scaledDelta * difficultyMult);
      return prevState[key] + scaledDelta;
    };
    if (evtMultiplier === 1 && difficultyMult === 1) return nextState;
    return _objectSpread(_objectSpread({}, nextState), {}, {
      money: applyScale('money'),
      income: applyScale('income'),
      gdp: applyScale('gdp')
    });
  };
  var applyComboBonus = function applyComboBonus(prevState, nextState) {
    var multiplier = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var normalizedMultiplier = Number.isFinite(multiplier) ? multiplier : Number(multiplier) || 1;
    if (normalizedMultiplier <= 1.0) return nextState;
    var applyScale = key => {
      var delta = nextState[key] - prevState[key];
      if (delta <= 0) return prevState[key];
      return prevState[key] + Math.round(delta * normalizedMultiplier);
    };
    return _objectSpread(_objectSpread({}, nextState), {}, {
      money: applyScale('money'),
      income: applyScale('income'),
      gdp: applyScale('gdp')
    });
  };
  var computeEnemyAfterAttack = (enemyState, cardState, nextPlayerState, comboMultiplier) => {
    var effected = cardState.targetEffect ? cardState.targetEffect(enemyState, nextPlayerState) : enemyState;
    var comboBoosted = applyComboBonus(enemyState, effected, comboMultiplier);
    var unrested = applyUnrestPenalty(comboBoosted, 'ライバル');
    return applySupportChange(unrested, cardState.targetSupportChange, 'ライバル');
  };
  var checkForNewMission = useCallback(playerState => {
    if (activeMission) return;
    var foundMission = MISSIONS.find(mission => mission.trigger(playerState));
    if (!foundMission) return;
    setActiveMission(_objectSpread(_objectSpread({}, foundMission), {}, {
      turnsRemaining: foundMission.turns
    }));
    addLog("".concat(lang === 'en' ? 'New mission:' : '新規ミッション:', " ").concat(getLoc(foundMission, 'name', lang)));
  }, [activeMission, addLog, lang]);
  var processMissionAtTurnEnd = useCallback(playerState => {
    if (!activeMission) {
      checkForNewMission(playerState);
      return;
    }
    var missionCompleted = activeMission.objective(playerState);
    if (missionCompleted) {
      var rewardCard = ALL_CARDS.find(card => card.id === activeMission.rewardCardId);
      if (rewardCard) {
        setPlayerHand(prev => [...prev, _objectSpread(_objectSpread({}, rewardCard), {}, {
          uniqueId: createRandomId()
        })]);
        addLog("".concat(lang === 'en' ? 'Mission complete! Reward card added:' : 'ミッション達成！報酬カード獲得:', " ").concat(getLoc(rewardCard, 'name', lang)));
      } else {
        addLog(lang === 'en' ? 'Mission complete!' : 'ミッション達成！');
      }
      setCompletedMissionCount(prev => prev + 1);
      setActiveMission(null);
      checkForNewMission(playerState);
      return;
    }
    var turnsRemaining = activeMission.turnsRemaining - 1;
    if (turnsRemaining <= 0) {
      addLog("".concat(lang === 'en' ? 'Mission failed:' : 'ミッション失敗:', " ").concat(getLoc(activeMission, 'name', lang)));
      setActiveMission(null);
      checkForNewMission(playerState);
      return;
    }
    setActiveMission(prev => prev ? _objectSpread(_objectSpread({}, prev), {}, {
      turnsRemaining
    }) : prev);
  }, [activeMission, checkForNewMission, addLog, lang]);
  var checkWinCondition = useCallback(function () {
    var nextPlayer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : player;
    var nextEnemy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : enemy;
    var currentTurn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : turn;
    if (gameState !== 'PLAYING') return false;
    var gameStatus = getGameStatus(nextPlayer, nextEnemy, currentDifficulty, currentTurn);
    if (gameStatus.status === 'ONGOING') return false;
    var isWin = gameStatus.status === 'WIN';
    setGameState(isWin ? 'WON' : 'LOST');
    SoundManager.playGameEnd(isWin);
    var result = evaluateGame(nextPlayer, currentDifficulty, isWin, IDEOLOGIES[selectedIdeology], lang, completedMissionCount);
    setEvaluation(result);
    return true;
  }, [gameState, player, enemy, currentDifficulty, turn, lang, completedMissionCount, selectedIdeology]);
  var playCard = useCallback(card => {
    var _card$combosWith;
    if (gameState !== 'PLAYING') return;
    var adjustedCost = calculateInflatedCost(card.cost, player.inflation, activeEvent, era);
    var comboReadyTags = ((_card$combosWith = card.combosWith) !== null && _card$combosWith !== void 0 ? _card$combosWith : []).filter(tag => lastTags.includes(tag));
    var providedTags = getCardProvidedTags(card);
    var isTech = providedTags.includes('tech');
    var eraMultiplier = era.id === 'IT_REV' && isTech ? 2 : 1;
    if (player.money < adjustedCost) {
      addLog(t('insufficientFunds', lang));
      return;
    }
    var successRate = calculateSuccessRate(card, player.support);
    var roll = rng() * 100;
    var isSuccess = roll < successRate;
    var afterCost = _objectSpread(_objectSpread({}, player), {}, {
      money: player.money - adjustedCost
    });
    var nextPlayerState = null;
    if (!isSuccess) {
      var penaltyState = afterCost;
      if (card.onFailure) penaltyState = card.onFailure(penaltyState);
      nextPlayerState = penaltyState;
      setPlayer(nextPlayerState);
      setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
      var {
          uniqueId: _discardedUniqueId2
        } = card,
        _baseCard = _objectWithoutProperties(card, _excluded);
      setDiscardPile(prev => [...prev, _baseCard]);
      setLastTags([]);
      return checkWinCondition(nextPlayerState, enemy);
    }
    var comboMultiplier = 1.0;
    if (comboReadyTags.length > 0) {
      comboMultiplier = 1.3;
    }
    if (card.type === 'ATTACK') {
      var afterSupport = applySupportChange(afterCost, card.supportChange, 'あなた');
      nextPlayerState = afterSupport || afterCost;
    } else {
      var baseState = card.effect(afterCost, enemy) || afterCost;
      var boostedState = baseState;
      if (eraMultiplier > 1) {
        var keys = ['money', 'income', 'gdp'];
        var boosted = _objectSpread({}, baseState);
        keys.forEach(key => {
          var delta = baseState[key] - afterCost[key];
          if (delta !== 0) boosted[key] = afterCost[key] + delta * eraMultiplier;
        });
        boostedState = boosted;
      }
      if (era.id === 'GROWTH') {
        var currentGdp = boostedState ? boostedState.gdp : afterCost.gdp;
        var deltaGdp = currentGdp - afterCost.gdp;
        if (deltaGdp > 0 && boostedState) {
          boostedState.gdp = afterCost.gdp + Math.round(deltaGdp * 1.5);
        }
      }
      var comboBoosted = applyComboBonus(afterCost, boostedState, comboMultiplier);
      var afterEvent = applyEventMultiplier(afterCost, comboBoosted);
      var inflationDelta = card.inflationChange || 0;
      if (era.id === 'GROWTH' && inflationDelta > 0) inflationDelta += 1;
      var afterInflation = applyInflationChange(afterEvent, inflationDelta);
      var afterUnrest = applyUnrestPenalty(afterInflation, 'あなた');
      var _afterSupport = applySupportChange(afterUnrest, card.supportChange, 'あなた');
      nextPlayerState = _afterSupport || afterCost;
    }
    var gdpGain = nextPlayerState.gdp - player.gdp;
    if (gdpGain > turnHighlight.gdpGain) {
      setTurnHighlight({
        gdpGain,
        text: 'gain'
      });
    }
    setPlayer(nextPlayerState);
    var nextEnemyState = enemy;
    if (card.type === 'ATTACK') {
      nextEnemyState = computeEnemyAfterAttack(enemy, card, nextPlayerState, comboMultiplier);
      setEnemy(nextEnemyState);
    }
    if (card.tip) {
      addLog("Memo: ".concat(getLoc(card, 'tip', lang)));
    }
    setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
    var {
        uniqueId: _discardedUniqueId
      } = card,
      baseCard = _objectWithoutProperties(card, _excluded2);
    setDiscardPile(prev => [...prev, baseCard]);
    if (providedTags.length > 0) {
      setLastTags(providedTags);
    } else {
      setLastTags([]);
    }
    checkForNewMission(nextPlayerState);
    return checkWinCondition(nextPlayerState, nextEnemyState);
  }, [gameState, player, enemy, lang, activeEvent, era, lastTags, gameDeck, discardPile, turnHighlight, checkForNewMission, checkWinCondition, addLog]);
  var aiTurn = () => {
    var _activeEvent$effect$i, _activeEvent$effect2;
    var driftTarget = 0;
    var eraIncomePenalty = 0;
    if (era.id === 'STAGNATION') {
      driftTarget = -2;
      eraIncomePenalty = 5;
    }
    var currentEnemyState = _objectSpread({}, enemy);
    var drifted = applyInflationDrift(currentEnemyState.inflation, driftTarget);
    var afterDrift = _objectSpread(_objectSpread({}, currentEnemyState), {}, {
      inflation: drifted
    });
    var ratingInfo = getRatingInfo(afterDrift.rating);
    var incomePenalty = Math.round(((_activeEvent$effect$i = activeEvent === null || activeEvent === void 0 || (_activeEvent$effect2 = activeEvent.effect) === null || _activeEvent$effect2 === void 0 ? void 0 : _activeEvent$effect2.incomePenalty) !== null && _activeEvent$effect$i !== void 0 ? _activeEvent$effect$i : 0) * ratingInfo.eventDamageMultiplier + eraIncomePenalty);
    var aiIncomeGain = Math.max(0, afterDrift.income - incomePenalty);
    var afterIncome = _objectSpread(_objectSpread({}, afterDrift), {}, {
      money: afterDrift.money + aiIncomeGain
    });
    afterIncome = applyInterestPayment(afterIncome, 'ライバル');
    var ratedEnemy = applyRatingUpdate(afterIncome, 'ライバル');
    var unrestAdjusted = applyUnrestPenalty(ratedEnemy, 'ライバル');
    var potentialActions = getPotentialActions({
      money: unrestAdjusted.money,
      inflation: unrestAdjusted.inflation,
      activeEvent,
      era,
      cards: ALL_CARDS,
      maxStandardCardId: MAX_STANDARD_CARD_ID
    });
    if (potentialActions.length === 0) {
      setEnemy(unrestAdjusted);
      return checkWinCondition(player, unrestAdjusted);
    }
    var aiCard = potentialActions[randomInt(potentialActions.length)];
    var inflatedCost = calculateInflatedCost(aiCard.cost, unrestAdjusted.inflation, activeEvent, era);
    var afterPayment = _objectSpread(_objectSpread({}, unrestAdjusted), {}, {
      money: unrestAdjusted.money - inflatedCost
    });
    if (aiCard.type === 'ATTACK') {
      var _afterSupport2 = applySupportChange(afterPayment, aiCard.supportChange, 'ライバル');
      var effected = aiCard.targetEffect ? aiCard.targetEffect(player, _afterSupport2) : player;
      var _unrested = applyUnrestPenalty(effected, 'あなた');
      var finalPreEvent = applySupportChange(_unrested, aiCard.targetSupportChange, 'あなた');
      var finalPlayer = applyEventMultiplier(player, finalPreEvent);
      setEnemy(_afterSupport2);
      setPlayer(finalPlayer);
      return checkWinCondition(finalPlayer, _afterSupport2);
    }
    var afterEffect = applyEventMultiplier(afterPayment, aiCard.effect(afterPayment, player));
    var afterInflation = applyInflationChange(afterEffect, aiCard.inflationChange);
    var unrested = applyUnrestPenalty(afterInflation, 'ライバル');
    var afterSupport = applySupportChange(unrested, aiCard.supportChange, 'ライバル');
    setEnemy(afterSupport);
    return checkWinCondition(player, afterSupport);
  };
  var proceedToNextTurn = () => {
    setShowTurnSummary(false);
    if (missionProcessedTurnRef.current !== turn) {
      processMissionAtTurnEnd(player);
      missionProcessedTurnRef.current = turn;
    }
    if (checkWinCondition(player, enemy, turn)) return;
    var aiEndedGame = aiTurn();
    if (!aiEndedGame) {
      var nextTurn = turn + 1;
      if (checkWinCondition(player, enemy, nextTurn)) return;
      setTurn(nextTurn);
      drawCards(1);
    }
    setLastTags([]);
    setTurnHighlight({
      gdpGain: 0,
      text: ''
    });
  };
  var updateSetting = (key, value) => {
    var handlers = {
      lang: setLang,
      fontSizeLevel: setFontSizeLevel,
      skipTurnSummary: setSkipTurnSummary,
      isMuted: setIsMuted,
      masterVolume: setMasterVolume
    };
    var handler = handlers[key];
    if (handler) {
      handler(value);
    }
  };
  var fontSizeClass = (_small$medium$large$f = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }[fontSizeLevel]) !== null && _small$medium$large$f !== void 0 ? _small$medium$large$f : 'text-base';
  var endTurn = () => {
    var _activeEvent$effect$i2, _activeEvent$effect3;
    if (gameState !== 'PLAYING' || showTurnSummary) return;
    setBondIssuedThisTurn(false);
    var currentPlayerState = _objectSpread({}, player);
    var driftTarget = 0;
    var eraIncomePenalty = 0;
    if (era.id === 'STAGNATION') {
      driftTarget = -2;
      eraIncomePenalty = 5;
    }
    var diffMult = currentDifficulty.eventDamageMultiplier || 1;
    var driftedInflation = applyInflationDrift(currentPlayerState.inflation, driftTarget);
    var ratingInfo = getRatingInfo(currentPlayerState.rating);
    var basePenalty = ((_activeEvent$effect$i2 = activeEvent === null || activeEvent === void 0 || (_activeEvent$effect3 = activeEvent.effect) === null || _activeEvent$effect3 === void 0 ? void 0 : _activeEvent$effect3.incomePenalty) !== null && _activeEvent$effect$i2 !== void 0 ? _activeEvent$effect$i2 : 0) * ratingInfo.eventDamageMultiplier + eraIncomePenalty;
    var incomePenalty = Math.round(basePenalty * diffMult);
    var playerIncomeGain = Math.max(0, currentPlayerState.income - incomePenalty);
    var playerAfterIncome = _objectSpread(_objectSpread({}, currentPlayerState), {}, {
      money: currentPlayerState.money + playerIncomeGain,
      inflation: driftedInflation
    });
    playerAfterIncome = applyInterestPayment(playerAfterIncome, 'あなた');
    var ratedPlayer = applyRatingUpdate(playerAfterIncome, 'あなた');
    var unrestApplied = applyUnrestPenalty(ratedPlayer, 'あなた');
    setPlayer(unrestApplied);
    processMissionAtTurnEnd(unrestApplied);
    missionProcessedTurnRef.current = turn;
    var summary = {
      turn,
      highlight: turnHighlight.text || 'turn end',
      warnings: []
    };
    setTurnSummaryData(summary);
    if (skipTurnSummary) {
      setAutoProceed(true);
    } else {
      setShowTurnSummary(true);
    }
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen ".concat(era.bgClass, " ").concat(fontSizeClass),
    children: [/*#__PURE__*/_jsxs("div", {
      className: "flex items-center gap-2",
      children: [/*#__PURE__*/_jsx("button", {
        onClick: () => setLang('en'),
        "data-testid": "lang-en",
        children: "English"
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => setLang('ja'),
        "data-testid": "lang-ja",
        children: "\u65E5\u672C\u8A9E"
      }), /*#__PURE__*/_jsxs("button", {
        onClick: () => setIsMuted(prev => !prev),
        "data-testid": "mute-toggle",
        className: "inline-flex items-center gap-1",
        children: [isMuted ? /*#__PURE__*/_jsx(IconVolumeX, {
          size: 16
        }) : /*#__PURE__*/_jsx(IconVolume2, {
          size: 16
        }), /*#__PURE__*/_jsx("span", {
          children: isMuted ? 'Unmute' : 'Mute'
        })]
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => setShowSettings(true),
        "data-testid": "open-settings",
        children: /*#__PURE__*/_jsx(IconSettings, {
          size: 16
        })
      })]
    }), gameState === 'TITLE' && /*#__PURE__*/_jsx("div", {
      children: /*#__PURE__*/_jsx("button", {
        onClick: () => setGameState('SETUP'),
        children: "START GAME"
      })
    }), gameState === 'SETUP' && /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsxs("label", {
        children: ["Difficulty:", /*#__PURE__*/_jsx("select", {
          value: selectedDifficulty,
          onChange: event => setSelectedDifficulty(event.target.value),
          "data-testid": "difficulty-select",
          children: Object.values(DIFFICULTY_SETTINGS).map(diff => /*#__PURE__*/_jsx("option", {
            value: diff.id,
            children: diff.label
          }, diff.id))
        })]
      }), /*#__PURE__*/_jsxs("label", {
        children: ["Ideology:", /*#__PURE__*/_jsx("select", {
          value: selectedIdeology,
          onChange: event => setSelectedIdeology(event.target.value),
          "data-testid": "ideology-select",
          children: Object.values(IDEOLOGIES).map(ideology => /*#__PURE__*/_jsx("option", {
            value: ideology.id,
            children: getLoc(ideology, 'name', lang)
          }, ideology.id))
        })]
      }), /*#__PURE__*/_jsx("button", {
        onClick: startGame,
        children: "START GAME"
      })]
    }), gameState === 'PLAYING' && /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsxs("span", {
          "data-testid": "current-difficulty",
          children: ["Difficulty: ", currentDifficulty.label]
        }), /*#__PURE__*/_jsxs("span", {
          "data-testid": "target-gdp",
          children: ["Target GDP: ", /*#__PURE__*/_jsx(NumberCounter, {
            value: currentDifficulty.targetGdp
          })]
        }), /*#__PURE__*/_jsxs("span", {
          "data-testid": "turn-indicator",
          children: ["Turn: ", turn, " / ", currentDifficulty.maxTurns, " (Remaining: ", Math.max(0, currentDifficulty.maxTurns - turn), ")"]
        })]
      }), /*#__PURE__*/_jsx(StatusPanel, {
        data: enemy,
        isEnemy: true,
        lang: lang
      }), /*#__PURE__*/_jsx(StatusPanel, {
        data: player,
        isEnemy: false,
        lang: lang
      }), /*#__PURE__*/_jsx(MissionPanel, {
        activeMission: activeMission,
        player: player,
        completedMissionCount: completedMissionCount,
        lang: lang
      }), /*#__PURE__*/_jsx(IdeologyMissionPanel, {
        activeMission: activeMission,
        player: player,
        lang: lang
      }), /*#__PURE__*/_jsxs("div", {
        children: [/*#__PURE__*/_jsx("h3", {
          children: t('yourHand', lang)
        }), /*#__PURE__*/_jsx("div", {
          children: playerHand.map(card => /*#__PURE__*/_jsx(CardButton, {
            card: card,
            onPlay: playCard,
            player: player,
            gameState: gameState,
            lang: lang,
            activeEvent: activeEvent,
            era: era
          }, card.uniqueId))
        }), /*#__PURE__*/_jsx("button", {
          onClick: repayDebt,
          disabled: gameState !== 'PLAYING' || (player.debt || 0) <= 0 || player.money < 50,
          children: "Repay"
        }), /*#__PURE__*/_jsx("button", {
          onClick: issueBonds,
          disabled: gameState !== 'PLAYING' || bondIssuedThisTurn,
          children: t('bond', lang)
        }), /*#__PURE__*/_jsx("button", {
          onClick: endTurn,
          children: t('endTurn', lang)
        }), /*#__PURE__*/_jsx("button", {
          onClick: () => setActiveEvent(EVENTS[0]),
          "data-testid": "trigger-event",
          children: "Trigger Event"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        "data-testid": "log-panel",
        children: [/*#__PURE__*/_jsx("h4", {
          children: "Activity Log"
        }), /*#__PURE__*/_jsx("ul", {
          children: logs.map(entry => /*#__PURE__*/_jsx("li", {
            children: entry.message
          }, entry.id))
        })]
      })]
    }), gameState === 'WON' || gameState === 'LOST' ? /*#__PURE__*/_jsxs("div", {
      "data-testid": "game-result",
      children: [/*#__PURE__*/_jsx("h2", {
        children: "Game End"
      }), /*#__PURE__*/_jsxs("div", {
        children: ["Result: ", gameState]
      }), /*#__PURE__*/_jsxs("div", {
        children: ["Reason: ", evaluation === null || evaluation === void 0 ? void 0 : evaluation.rankLabel]
      }), /*#__PURE__*/_jsx("button", {
        onClick: () => setGameState('TITLE'),
        children: "Back to Start"
      })]
    }) : null, /*#__PURE__*/_jsx(TurnSummaryPanel, {
      data: turnSummaryData,
      onContinue: proceedToNextTurn,
      lang: lang
    }), /*#__PURE__*/_jsx(SettingsModal, {
      isOpen: showSettings,
      onClose: () => setShowSettings(false),
      settings: {
        lang,
        fontSizeLevel,
        skipTurnSummary,
        isMuted,
        masterVolume
      },
      onChange: updateSetting
    })]
  });
}
export default EconomicCardGame;
export { SoundManager as SoundManagerInstance, evaluateGame, resolveBondRisk, clampInflation, INFLATION_MIN, INFLATION_MAX, CrisisOverlay, applyInflationDrift, secureRandom, getGameStatus };