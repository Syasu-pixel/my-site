# 01 Drilling Line — GX Works2 Batch D Migration Diff

Status: Active / Section 09–11 logic migration ready / input & sim pending

## 1. Scope

This file defines the GX Works2 / FX3U migration points for Batch D:

- Section 09 MANUAL
- Section 10 OUTPUT_REQUEST
- Section 11 ACTUAL_OUTPUT

The GX Works3 logic structure is retained unless a GX Works2 / FX3U-specific difference requires confirmation.

## 2. Logic retained as-is

The following design rules remain valid for GX Works2:

- GOT request must not drive Y directly.
- Manual path remains `GOT req -> MANUAL M830–M854 -> COMMON M860–M884 -> Y -> FB`.
- Common manual permit remains based on manual mode, auto stopped, no fault, and required safety-monitor inputs.
- AUTO and MANUAL requests are combined only in Section 10.
- Actual Y coils are centralized in Section 11.
- No double coil for Y.
- Opposing solenoid requests must not be active together.
- Contradictory manual requests fail safe to both-off.
- M330 is AUTO-specific and must not be reused as the CV04 manual machine-accept condition.
- M166 is spindle RUN feedback, not verified zero speed.

## 3. Device bands retained

Keep these internal ranges unless the actual GX Works2 project proves a conflict:

- GOT request: M900–M913, M980–M990
- MANUAL request: M830–M854
- COMMON request: M860–M884
- GOT diagnostic / block reason: M940–M955
- physical feedback: M126–M167

Do not invent replacement M devices merely because the project was moved from GX Works3 to GX Works2.

## 4. Manual common permit

Conceptual condition remains:

```text
M300
AND NOT M305
AND NOT M324
AND M110
AND M112
AND M113
AND M114
AND M115
```

GX Works2 confirmation items:

- [ ] contact notation entered exactly as intended
- [ ] M111 low-air handling is kept operation-specific where required
- [ ] manual mode cannot enable ordinary manual requests while AUTO is running
- [ ] fault / safety-monitor loss blocks ordinary manual motion requests

## 5. CV manual migration

Keep the existing paths:

```text
M900 -> M830 -> M860 -> Y0
M901 -> M831 -> M861 -> Y1
M902 -> M832 -> M862 -> Y2
M903 -> M833 -> M863 -> Y3
```

### CV04 special rule

Do not use AUTO-only `M330` directly for the manual CV04-to-station permission.

Use the existing conceptual `CV04_MANUAL_MACHINE_PERMIT` / manual station accept logic based on actual machine state.

GX Works2 checks:

- [ ] M903 request does not pass while T3/T4 interference exists
- [ ] destination / station state blocks CV04 as designed
- [ ] M946 blocked-reason logic follows the manual-specific acceptance condition
- [ ] no new station-side conveyor Y is invented

## 6. ST01–ST05 manual migration

Maintain opposing request pairs:

- ST01: M834 / M835 -> M864 / M865 -> Y4 / Y5
- ST02: M836 / M837 -> M866 / M867 -> Y6 / Y7
- ST03: M838 / M839 -> M868 / M869 -> Y10 / Y11
- ST04: M840 / M841 -> M870 / M871 -> Y12 / Y13
- ST05: M842 / M843 -> M872 / M873 -> Y14 / Y15

GX Works2 confirmation:

- [ ] simultaneous UP+DOWN request gives neither output
- [ ] Section 10 keeps final mutual exclusion
- [ ] Section 11 still prevents both physical Y outputs from turning on together
- [ ] ST05 manual direction respects station-work / discharge-full interference rules

Double-solenoid hold-vs-pulse output style remains TBD and must not be guessed.

## 7. CY01–CY05 manual migration

Maintain the existing chains:

- CY01: M844/M845 -> M874/M875 -> Y16/Y17
- CY02: M846/M847 -> M876/M877 -> Y20/Y21
- CY03: M848/M849 -> M878/M879 -> Y22/Y23
- CY04: M850/M851 -> M880/M881 -> Y24/Y25
- CY05: M852/M853 -> M882/M883 -> Y26/Y27

Key interlocks remain:

- CY03 position request requires jig work confirmation where defined.
- CY04 clamp requires work and positioning confirmation.
- CY05 down requires work, positioning, clamp, spindle RUN feedback and no spindle fault.

GX Works2 checks:

- [ ] opposite cylinder requests fail to both-off
- [ ] clamp cannot occur without its required work/position conditions
- [ ] drill-down cannot occur without M166 RUN feedback
- [ ] M167 spindle fault blocks drill-down

## 8. Spindle manual migration

Keep:

```text
M990 -> M854 -> M884 -> Y30 -> M166/M167
```

Required conditions remain based on work position, clamp, drill-up position, no spindle fault and final spindle machine/output permit.

Do not add a zero-speed input that does not exist in the physical I/O map.

## 9. Section 10 OUTPUT_REQUEST migration

Keep the AUTO/MANUAL OR structure and final exclusion.

Examples:

```text
(M800 OR M830) -> M860
(M801 OR M831) -> M861
...
(M824 OR M854) -> M884
```

For opposite-direction devices, retain the pattern where each side requires the opposite request to be OFF.

GX Works2 confirmation:

- [ ] M860–M884 each have one intended logic source
- [ ] AUTO and MANUAL can never create an illegal opposing pair
- [ ] machine/output permit conditions are not silently removed during migration
- [ ] unresolved `*_MACHINE_PERMIT` and `*_OUTPUT_PERMIT` remain explicit TBDs

## 10. Section 11 ACTUAL_OUTPUT migration

Keep physical Y centralized:

```text
M860->Y0   M861->Y1   M862->Y2   M863->Y3
M864->Y4   M865->Y5   M866->Y6   M867->Y7
M868->Y10  M869->Y11  M870->Y12  M871->Y13
M872->Y14  M873->Y15
M874->Y16  M875->Y17
M876->Y20  M877->Y21
M878->Y22  M879->Y23
M880->Y24  M881->Y25
M882->Y26  M883->Y27
M884->Y30
```

Before entering this into GX Works2, confirm that the selected FX3U physical output allocation matches the project's actual module setup.

No other Section may directly drive these Y devices.

## 11. GX Works2 / FX3U-specific confirmations

The following require actual GX Works2 project verification:

- [ ] selected FX3U project type accepts the intended M ranges
- [ ] Y addresses used by the current design are valid in the actual CPU / extension layout
- [ ] device comments can be imported/entered without range conflict
- [ ] duplicate-coil check shows no Y double coil
- [ ] SET/RST usage for manual helper states, where used, compiles as intended
- [ ] GX Simulator2 can force/monitor the required M/X/Y devices for Batch D testing

## 12. GX Simulator2 test cases

Do not mark PASS until actually run.

| ID | Test | Expected |
|---|---|---|
| D-SIM-W2-01 | M300 OFF + manual request | MANUAL request remains OFF |
| D-SIM-W2-02 | M305 ON + manual request | blocked |
| D-SIM-W2-03 | M324 ON + manual request | blocked |
| D-SIM-W2-04 | ST opposing GOT requests together | both MANUAL outputs OFF |
| D-SIM-W2-05 | CY opposing GOT requests together | both MANUAL outputs OFF |
| D-SIM-W2-06 | CV01 valid request | M900->M830->M860->Y0 |
| D-SIM-W2-07 | CV04 invalid machine state | M833 OFF, blocked reason active |
| D-SIM-W2-08 | CY04 clamp without M141 or M147 | M851 OFF |
| D-SIM-W2-09 | CY05 down without M166 | M853 OFF |
| D-SIM-W2-10 | CY05 down with M167 ON | M853 OFF |
| D-SIM-W2-11 | spindle request with valid conditions | M990->M854->M884->Y30 |
| D-SIM-W2-12 | spindle fault ON | M854/M884/Y30 blocked per logic |
| D-SIM-W2-13 | AUTO request only | COMMON and Y follow AUTO chain only |
| D-SIM-W2-14 | MANUAL request only | COMMON and Y follow MANUAL chain only |
| D-SIM-W2-15 | illegal opposite AUTO/MANUAL combination | both physical opposing outputs OFF |
| D-SIM-W2-16 | scan project for duplicate Y coils | none outside Section 11 |
| D-SIM-W2-17 | GOT request released | no unintended latched manual motion request remains |
| D-SIM-W2-18 | M166 OFF after spindle stop | do not treat as verified zero speed |

## 13. Remaining TBDs

Keep these unresolved until the corresponding machine specification is finalized:

- each `*_MACHINE_PERMIT`
- each `*_OUTPUT_PERMIT`
- double-solenoid hold/pulse behavior
- formal T4 station-side transfer mechanism
- M515 discharge drive method
- spindle zero-speed / stop-complete confirmation method

Do not allocate new M/D/Y devices to close these TBDs without updating the authoritative maps.

## 14. Status

- design logic: READY FOR MIGRATION
- GX Works2 ladder input: PENDING
- GX Simulator2 execution: PENDING
- physical-machine applicability: not established by this document

Current judgment:

**BATCH D LOGIC MIGRATION READY / GX WORKS2 INPUT PENDING / SIM PENDING**
