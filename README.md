# Spitsgids
The API that returns a value (which indicates empty, in between or busy) for every train connection on the NMBS network. It got it's data from the NMBS, user feedback, a survey and iRail.

## How to use

## How to setup

## Technical info
The database contains 5 tables with data: one general table which contains a value of each connection (between two stations), an NMBS table, a user feedback table, a survey table and an iRail table.

### General table
Contains a value of each connection (between two stations). This value is a value between 0 and 2 which can get translated to a score (empty, in between or busy) in the front-end. The formula to calculate this value is:

```
Value = (aX + bY + cZ)/3

X = NMBS-value
Y = Survey-value
Z = iRail-value

a = Calibrated by user feedback
b = Calibrated by user feedback
c = Calibrated by user feedback
```

### NMBS table
Contains 11 trains which the NMBS indicated where busy or in between. The NMBS-value will always be 1 or 2.

### User feedback table
Contains values that are returned by the users of iRail, Railer and BeTrains. These users can indicate a crowding-score on the train of 0 (calm), 1 (in between) and 2 (busy). The values will be calculated historically and will be a number between 0 and 2.

### Survey table
Contains values that are created by a survey sent by iRail and TreinTramBus ([Survey](https://goo.gl/zuSR5u)). These values are in between 0 and 2.

### iRail table
Creates a table with historic data by GETting the iRail queries every X minutes. A number can be created to indicate the general crowding on a certain connection. The formula to calculate this value is:

```
Value =
```
