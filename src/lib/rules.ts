export type RuleOption = {
  id: string; // e.g. "3.10"
  title: string;
  description: string;
  group: string;
};

export const RULES: RuleOption[] = [
  // 1. GENERAL RULES
  { id: "1.1", title: "Working Microphone", description: "All players must have a working, clear microphone. If staff cannot communicate with you or you cannot participate in RP scenes properly, you may be removed from the scene or server.", group: "1. General Rules" },
  { id: "1.2", title: "Staff Impersonation", description: "Impersonating staff in any form—names, tags, commands, or authority—is strictly prohibited.", group: "1. General Rules" },
  { id: "1.3", title: "Cheating / Hacking", description: "Any usage of cheats, hacks, or game-breaking exploits is an instant, permanent ban with no appeal.", group: "1. General Rules" },
  { id: "1.4", title: "Advertising", description: "No advertising of other servers, communities, Discords, or services in any form (public, OOC, or DMs).", group: "1. General Rules" },
  { id: "1.5", title: "Realistic Character Names", description: "Characters must have realistic U.S.-based names. No memes, joke names, or lore-breaking names.", group: "1. General Rules" },
  { id: "1.6", title: "External Software", description: "No third-party enhancement tools that offer mechanical, informational, detection, or visual advantages.", group: "1. General Rules" },
  { id: "1.7", title: "Hate Speech", description: "Racism, homophobia, ableism, religious hatred, or targeted harassment is never allowed IC or OOC.", group: "1. General Rules" },
  { id: "1.8", title: "Immersion", description: "All players must use RP terminology: 'Emails' instead of Discord, 'Headache' instead of crash, 'Government' for staff. Breaking character or calling out server mechanics is not permitted.", group: "1. General Rules" },
  { id: "1.9", title: "Whitelisted Vehicles", description: "You may not steal police, EMS, or mechanic vehicles unless the RP scenario directly justifies it and is realistic.", group: "1. General Rules" },

  // 2. REPORTING A PLAYER
  { id: "2.1", title: "Recording Recommended", description: "Use Medal, Shadowplay, or OBS. No evidence = no valid report.", group: "2. Reporting a Player" },
  { id: "2.2", title: "Audio Required", description: "Reports must include in-game audio and player voice.", group: "2. Reporting a Player" },
  { id: "2.3", title: "Minimum Clip Length", description: "5 minutes of context minimum.", group: "2. Reporting a Player" },
  { id: "2.4", title: "Proper Reporting Format", description: "Must include player description, gang/affiliation (if known), scenario explanation, and full unedited clip.", group: "2. Reporting a Player" },
  { id: "2.5", title: "False Reports", description: "Submitting misleading reports will result in punishment.", group: "2. Reporting a Player" },

  // 3. IN-GAME RULES
  { id: "3.1", title: "Suicide / Terror RP", description: "Suicide / Terror RP is prohibited.", group: "3. In-Game Rules" },
  { id: "3.2", title: "Realistic Character Behavior", description: "Must align with personality, backstory, and common sense.", group: "3. In-Game Rules" },
  { id: "3.3", title: "Law Enforcement Impersonation", description: "Not permitted without admin approval.", group: "3. In-Game Rules" },
  { id: "3.4", title: "Off-Duty Restrictions", description: "No off-duty police/EMS gear, tools, weapons, or vehicles.", group: "3. In-Game Rules" },
  { id: "3.5", title: "Emergency Services Theft", description: "Items such as tasers, radios, badges, armor require prior approval before theft.", group: "3. In-Game Rules" },
  { id: "3.6", title: "Injury RP", description: "Crashes and injuries must be portrayed realistically.", group: "3. In-Game Rules" },
  { id: "3.7", title: "Voice Recognition", description: "You may only identify someone by voice if your character knows them well IC.", group: "3. In-Game Rules" },
  { id: "3.8", title: "Baiting", description: "Provoking cops/players without RP reason is Fail RP.", group: "3. In-Game Rules" },
  { id: "3.9", title: "VDM", description: "No using vehicles as weapons without proper RP buildup.", group: "3. In-Game Rules" },
  { id: "3.10", title: "RDM", description: "No attacking/killing without valid RP reasoning.", group: "3. In-Game Rules" },
  { id: "3.11", title: "Scene Interference", description: "Do not interfere with scenes you aren’t involved in.", group: "3. In-Game Rules" },
  { id: "3.12", title: "Medical RP", description: "You must RP with EMS.", group: "3. In-Game Rules" },
  { id: "3.13", title: "Spectator Rule", description: "Do not loiter around active scenes without reason.", group: "3. In-Game Rules" },
  { id: "3.14", title: "Robbing Players", description: "You may kill OR rob, not both. Leave food/water so they can continue RP.", group: "3. In-Game Rules" },
  { id: "3.15", title: "Vehicle Switching", description: "No switching cars, using garages, or stashing vehicles mid-pursuit. Planned decamp cars allowed.", group: "3. In-Game Rules" },
  { id: "3.16", title: "Excessive Spam Tackling (NEW)", description: "Tackling should be used sparingly and realistically. Excessive spam tackling ruins immersion and is considered Fail RP.", group: "3. In-Game Rules" },
  { id: "3.17", title: "Failing to Stop / Unrealistic Evasion (NEW)", description: "Running from police constantly for minor crimes should not be the norm; flee only with strong IC justification.", group: "3. In-Game Rules" },

  // 4. VALUE OF LIFE (VoL)
  { id: "4.1", title: "Fear for Life", description: "If a gun is pointed at you or you're outnumbered, you must comply realistically.", group: "4. Value of Life" },
  { id: "4.2", title: "Fear for Freedom", description: "Avoid actions clearly leading to arrest unless the story makes sense.", group: "4. Value of Life" },
  { id: "4.3", title: "Locked Vehicle Rule", description: "If inside a locked vehicle and not in immediate danger, you are not required to exit.", group: "4. Value of Life" },
  { id: "4.4", title: "Failing to Fear Police Weapons (NEW)", description: "When officers draw firearms or tasers, you must show realistic fear; comply unless extreme justification.", group: "4. Value of Life" },

  // 5. STAYING IN CHARACTER
  { id: "5.1", title: "IC Consistency", description: "Never break character. Staff = “angels,” Discord = “emails,” etc.", group: "5. Staying in Character" },
  { id: "5.2", title: "Rule Breaks During RP", description: "Report later; do not interrupt scenes.", group: "5. Staying in Character" },

  // 6. HOSTAGE / ROBBERY / KIDNAPPING RULES (UPDATED)
  { id: "6.1", title: "Hostage Restrictions", description: "Hostages are restricted to specific heists/robberies per server rules (Big Bank/Vangelico/Small Banks/Stores conditions).", group: "6. Hostage / Robbery Rules" },

  // 7. COMBAT LOGGING & ITEM STORING
  { id: "7.1", title: "Logging During RP", description: "Not allowed under any circumstances.", group: "7. Combat Logging & Storing" },
  { id: "7.2", title: "Storing Vehicles Mid-Scene", description: "Not allowed.", group: "7. Combat Logging & Storing" },
  { id: "7.3", title: "Logging to Avoid Consequences", description: "Not permitted.", group: "7. Combat Logging & Storing" },

  // 8. NEW LIFE RULE (NLR)
  { id: "8.1", title: "Death = Memory Loss", description: "You forget events leading to your death.", group: "8. New Life Rule" },
  { id: "8.2", title: "Gang Conflict Deaths", description: "You forget who killed you and why.", group: "8. New Life Rule" },
  { id: "8.3", title: "No Returning to Death Scene (30m)", description: "Do not return to your death scene for 30 minutes.", group: "8. New Life Rule" },

  // 9. GREEN PLAYERS
  { id: "9.1", title: "Protected Roles", description: "EMS and business employees cannot be robbed or harmed while on duty.", group: "9. Green Players" },

  // 10. GREEN ZONES
  { id: "10.1", title: "Definition", description: "Areas where crime cannot be initiated.", group: "10. Green Zones" },
  { id: "10.2", title: "Zones", description: "Green zones prohibit fighting/weapon usage. Amber zones allow hostility only with reasonable RP.", group: "10. Green Zones" },

  // 11. DRIVING & VEHICLE RULES
  { id: "11.1", title: "Stunt Driving", description: "No unrealistic stunts.", group: "11. Driving Rules" },
  { id: "11.1.1", title: "Small Jumps Allowed", description: "Small bumps/curbs/jumps only when realistic for the vehicle, speed, incline and landing.", group: "11. Driving Rules" },
  { id: "11.2", title: "No Ramming", description: "Blocking ok, ramming not.", group: "11. Driving Rules" },
  { id: "11.3", title: "Off-Road Restrictions", description: "Only appropriate vehicles may off-road.", group: "11. Driving Rules" },
  { id: "11.4", title: "Off-Road Realism", description: "No vertical hill climbs or unrealistic terrain.", group: "11. Driving Rules" },
  { id: "11.5", title: "Emergency Vehicle Conduct", description: "Lights/sirens required when breaking traffic laws.", group: "11. Driving Rules" },
  { id: "11.6", title: "Crash RP", description: "High-speed impacts require injury RP.", group: "11. Driving Rules" },
  { id: "11.8", title: "Blocking & Boxing", description: "If boxed in, you may decamp but not push cars unrealistically.", group: "11. Driving Rules" },

  // 12. METAGAMING
  { id: "12.1", title: "Using OOC Information IC", description: "Using information obtained outside of RP (Discord, streams, clips, DMs) inside the game is prohibited.", group: "12. Metagaming" },
  { id: "12.2", title: "Stream Sniping", description: "Watching someone’s stream to gain information or track them is forbidden.", group: "12. Metagaming" },
  { id: "12.3", title: "External Communications", description: "All communication must occur in-game. No Discord calls/chats during active RP.", group: "12. Metagaming" },
  { id: "12.4", title: "Crime Coordination", description: "Coordinating criminal activity outside the game is metagaming unless roleplayed in-game.", group: "12. Metagaming" },
  { id: "12.5", title: "Realistic Knowledge", description: "Your character only knows what they learn naturally in RP; cannot assume knowledge via OOC methods.", group: "12. Metagaming" },

  // 13. POWERGAMING
  { id: "13.1", title: "Exploiting Mechanics", description: "No abusing mechanics/glitches to defy realism or force outcomes.", group: "13. Powergaming" },
  { id: "13.2", title: "Forced Outcomes", description: "Do not force actions on others without time to react.", group: "13. Powergaming" },
  { id: "13.3", title: "Bodycams", description: "Only EMS/LEO may reference bodycams IC. Civilians cannot claim bodycams unless approved.", group: "13. Powergaming" },
  { id: "13.4", title: "Fair Use of Strength & Actions", description: "No superhuman strength, instant lockpicking, or perfect knowledge.", group: "13. Powergaming" },
  { id: "13.5", title: "Roleplay Over Mechanics", description: "If mechanics fail, use RP to justify or compensate.", group: "13. Powergaming" },

  // 14. FORCED RP
  { id: "14.1", title: "Inserting Yourself Into Scenes", description: "Do not force yourself into RP you weren’t involved in without logical reason.", group: "14. Forced RP" },
  { id: "14.2", title: "Forced RP Without Interaction", description: "Kidnapping/attacking/restraining must have buildup; cannot be instant.", group: "14. Forced RP" },
  { id: "14.3", title: "Giving Players Options", description: "Give chances to react. RP should be interactive, not one-sided.", group: "14. Forced RP" },
  { id: "14.4", title: "Respecting Engagement Boundaries", description: "Collaborate—don’t dominate storylines or scenes.", group: "14. Forced RP" },

  // 15. NINJA LOOTING
  { id: "15.1", title: "Looting Without RP", description: "Taking items from downed players without RP is prohibited.", group: "15. Ninja Looting" },
  { id: "15.2", title: "Required RP", description: "Looting must be shown using /me searches pockets or /do would I find anything?", group: "15. Ninja Looting" },
  { id: "15.3", title: "Uninvolved Looting", description: "Do not loot bodies from scenes you were not involved in.", group: "15. Ninja Looting" },
  { id: "15.4", title: "Respect the Scene", description: "If a scene is ongoing, do not approach to loot.", group: "15. Ninja Looting" },

  // 16. WEAPON PLAY, GUNPLAY & KILLING
  { id: "16.1", title: "Shoot-to-Win", description: "Gunplay must never be prioritized over RP. Killing should be a last resort.", group: "16. Weapon Play" },
  { id: "16.2", title: "Escalation Must Be Earned", description: "Weapons escalation needs meaningful storyline stakes.", group: "16. Weapon Play" },
  { id: "16.3", title: "Realistic Gunfights", description: "Use cover, portray fear, avoid heroic behavior, and roleplay injuries.", group: "16. Weapon Play" },
  { id: "16.4", title: "Killing Justification", description: "Must have meaningful IC reasoning. Not for disrespect, loot, or random civilians.", group: "16. Weapon Play" },
  { id: "16.5", title: "Downed Players", description: "Finish OR leave. Not both. Do not loot then finish unless storyline supports.", group: "16. Weapon Play" },
  { id: "16.6", title: "Ambushes & Setups", description: "Ambushes must have planning and logical reason—not random killings.", group: "16. Weapon Play" },

  // 17. STORYLINES & LONG-TERM RP
  { id: "17.1", title: "Character Consistency", description: "Characters must follow established backstory and motivations.", group: "17. Storylines & Long-Term RP" },
  { id: "17.2", title: "Long-Term Growth", description: "Build relationships and conflicts gradually over days/weeks/months.", group: "17. Storylines & Long-Term RP" },
  { id: "17.3", title: "Stages of Conflict", description: "Conflict should escalate naturally from disagreement to violence (last resort).", group: "17. Storylines & Long-Term RP" },
  { id: "17.4", title: "Emotional RP", description: "Characters should show fear, anger, stress, panic, regret, adrenaline responses.", group: "17. Storylines & Long-Term RP" },
  { id: "17.5", title: "Actions Have Consequences", description: "Criminal choices should have consequences: police, retaliation, loss of allies, danger.", group: "17. Storylines & Long-Term RP" },
  { id: "17.6", title: "Avoid Meaningless RP", description: "Avoid empty conflict or violence with no story behind it.", group: "17. Storylines & Long-Term RP" },
];

// ✅ THIS is what your CaseView is importing
export const RULES_BY_ID = new Map(RULES.map((r) => [r.id, r]));
