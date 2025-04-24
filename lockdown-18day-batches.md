# Lockdown Component Enhancement: 18-Day Batch Management

This PR enhances the Lockdown component by adding specialized tracking and display of batches that have reached 18 days of incubation and are ready for transfer to hatchers.

## Changes Made

1. **Interface Updates:**
   - Added `label` field to the `LockdownFormData` interface to track the house/location
   - Added `day` field to track incubation days
   - Updated initial data to include these new fields

2. **Pending Transfers Logic:**
   - Modified the `pendingTransfers` counter to specifically track batches that:
     - Have reached 18 days or more (day >= 18)
     - Have not yet been transferred (transferredTo is empty)
   - Added a new selector `eighteenDayBatches` that filters batches meeting these criteria

3. **UI Enhancements:**
   - Added a dedicated "Pending Transfers (18-Day Batches)" section that displays only batches meeting the 18-day transfer criteria
   - Enhanced the columns in tables to include:
     - Batch ID
     - Label (house)
     - Lockdown Date
     - Day (incubation day)
     - Quantity
     - Status
   - Added appropriate styling to distinguish the pending transfers section

4. **Form Updates:**
   - Updated the edit/add form to include fields for Label and Day
   - Added validation to ensure day field is stored as a number

## Testing

The component has been tested to ensure:
- Batches with day values of 18 or higher appear in the pending transfers section
- The counter for pending transfers correctly reflects only 18+ day batches
- The form allows entry and editing of all required fields

## Screenshots

[Screenshots would be included here in a real PR] 