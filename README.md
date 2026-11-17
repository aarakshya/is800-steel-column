# Steel column design to IS 800:2007

A single-page calculator that checks a steel column to IS 800:2007 (limit state method) and says whether it passes or fails. It runs in the browser with no server and no install. It is the companion to [is800-steel-beam](https://github.com/aarakshya/is800-steel-beam).

Open `index.html`, or use the GitHub Pages link once Pages is switched on for this repository.

## Sections

- Rolled I-sections: ISHB, ISSC, ISWB, ISMB, ISLB, ISJB, NPB and WPB
- Channels: ISMC, ISLC, ISMPC and ISJC
- Hollow sections: SHS, RHS (IS 4923) and CHS (IS 1161), cold formed or hot finished
- A welded I-section built from plate sizes you enter
- A built-up column of two channels (back to back, or toes facing in) or two I-sections side by side, joined by battens

The section data comes from the open [Osdag](https://github.com/osdag-admin/Osdag) database (IIT Bombay), which follows the IS 808, IS 4923 and IS 1161 tables. A button finds the lightest section of the chosen type that passes every check.

## Section builder

For a built-up column the input panel shows the section to scale. Drag either component sideways to change the gap and watch r<sub>z</sub>, r<sub>y</sub>, A and I update. Buttons set the gap for r<sub>y</sub> = r<sub>z</sub> or r<sub>y</sub> = 1.1 r<sub>z</sub>. Another button sizes the battens (bays, depths, thickness, lap and weld) to the code minimums and then steps them up until every batten check passes.

## Loads

Any number of factored load combinations, each with an axial force and end moments about both axes at the top and bottom. Moments with the same sign give single curvature. Self weight can be added. End conditions come from Table 11 (or a user K) for each axis, with a separate unbraced length about y-y and a separate length for lateral-torsional buckling.

## Checks

| Check | Clause |
|---|---|
| Section classification under axial force, or axial force with bending | 3.7.2, Table 2 |
| Slenderness limit | 3.8, Table 3 |
| Flexural buckling about both axes, buckling class from Table 10 | 7.1.2, 7.1.2.1 |
| Bending strength and lateral-torsional buckling, C<sub>1</sub> from the end moment ratio | 8.2.1.2, 8.2.2, Annex E |
| Shear from the end moments | 8.4.1, 9.2.2 |
| Section strength under axial force and biaxial bending | 9.3.1 |
| Member buckling interaction, both equations | 9.3.2.2, Table 18 |
| Battened columns: 1.1 slenderness factor, three bays, r<sub>y</sub> ≥ r<sub>z</sub> | 7.7.1 |
| Batten spacing (component slenderness ≤ 50 and ≤ 0.7λ) | 7.7.3 |
| Batten forces V<sub>b</sub> = V<sub>t</sub>C/(NS) and M = V<sub>t</sub>C/(2N), with any actual shear added | 7.7.2.1 |
| Batten depth, thickness and lap | 7.7.2.3, 7.7.4.1 |
| Batten plate shear and bending stress | 8.4.1, 8.2.1 |
| Fillet weld size and weld group stress | 10.5.2.3, Table 21, 10.5.7 |

Each result shows the full working with clause numbers, a table of all combinations, the column with its end moments, drawings of the section and the batten layout, and a list of items to fix. Results export to PDF and Excel.

## Limits

Not covered: slender sections (7.3.2 effective area), torsional and flexural-torsional buckling of single channels, loads along the height, tension, laced columns, bolted battens, splices and bases, holes, tapered members, seismic design and fatigue. A built-up column with M<sub>y</sub> is flagged, because 7.7.1.2 asks for an exact stability analysis or tests when there are moments in the plane of the battens. The channel centroid and the y-y plastic moduli of rolled sections are computed from an idealized shape with parallel flanges, as the tables used here do not give them.

## Tests

`tools/engine.js` is the calculation engine on its own. `tools/test.js` checks it against IS 800 Table 9 compressive stresses, Annex E C<sub>1</sub> values and hand calculations of a pinned ISHB column, the built-up gap for equal radii, the battened slenderness factor, batten forces and stresses, and the reduced moment for a rolled I:

```
cd tools && node test.js
```

## Files

- `index.html`: the app
- `lib/`: jsPDF, jsPDF-AutoTable, SheetJS and the DejaVu font, used for export

Developed by Aarakshya Kandel.
