exports.positions = [
    { name: "Center Forward", id: 1, abbreviation: "CF" },
    { name: "Right Wing", id: 2, abbreviation: "RW" },
    { name: "Left Wing", id: 3, abbreviation: "LW" },
    { name: "Center Midfield", id: 4, abbreviation: "CM" },
    { name: "Right Midfield", id: 5, abbreviation: "RM" },
    { name: "Left Midfield", id: 6, abbreviation: "LM" },
    { name: "Center Attacking Midfield", id: 7, abbreviation: "CAM" },
    { name: "Center Defensive Midfield", id: 8, abbreviation: "CDM" },
    { name: "Center Back", id: 9, abbreviation: "CB" },
    { name: "Right Back", id: 10, abbreviation: "RB" },
    { name: "Left Back", id: 11, abbreviation: "LB" },
    { name: "Goalkeeper", id: 12, abbreviation: "GK" }
];

exports.physicalTraining = [
    { type: "Strength", effect: "PHY", effect_value: 1 },
    { type: "Power", effect: "PHY", effect_value: 1 },
    { type: "Endurance" , effect: "PHY", effect_value: 1 },
    { type: "Mobility" , effect: "PHY", effect_value: 1 },
    { type: "Stability" , effect: "PHY", effect_value: 1 },
    { type: "Recovery", effect: "PHY", effect_value: 1  },
    { type: "Speed", effect: "PAC", effect_value: 1 },
    { type: "Agility", effect: "PHY", effect_value: 1 }
];

exports.technicalTraining = [
    { type: "Passing", effect: "PAS", effect_value: 1 },
    { type: "Tackling", effect: "DEF", effect_value: 1 },
    { type: "Ball Control", effect: "DRI", effect_value: 1 },
    { type: "Possesion", effect: "PAS", effect_value: 1 },
    { type: "Positioning", effect: "DEF", effect_value: 1 },
    { type: "Finishing", effect: "SHO", effect_value: 1 },
    { type: "Shooting", effect: "SHO", effect_value: 1 },
    { type: "Dribbling", effect: "DRI", effect_value: 1 },
    { type: "Heading", effect: "SHO", effect_value: 1 }
];

exports.tacticalTraining = [
    { type: "Set Pieces", effect: "PAS", effect_value: 1 },
    { type: "Formations", effect: "DEF", effect_value: 1 },
    { type: "Attacking", effect: "SHO", effect_value: 1 } ,
    { type: "Defensive", effect: "DEF", effect_value: 1 }
];
