# TM11 PrimeTime

## Current State
- Users register, submit UPI payment (UTR), and await admin approval
- On approval, commission is credited up the referral chain (levels 1/2/3)
- Dashboard shows commission balance and commission history
- Admin can approve, reject, or remove users via AdminUsersPage
- Types: User has `commissionBalance: number`, no wallet concept or withdrawal concept
- store.ts `approveUser()` handles status change + commission distribution; no bonus credit
- No withdrawal model exists anywhere

## Requested Changes (Diff)

### Add
- `walletBalance` field on the `User` type (separate from `commissionBalance`)
- Rs.150 joining bonus: credited automatically when admin approves a user (inside `approveUser()` in store.ts)
- `WithdrawalRequest` type: `{ id, userId, amount, upiId, status: 'pending'|'approved'|'rejected', requestedAt, processedAt? }`
- `WITHDRAWALS_KEY` in store.ts with `getWithdrawals()`, `saveWithdrawals()`, `addWithdrawalRequest()`, `approveWithdrawal()`, `rejectWithdrawal()` helpers
- New page `WalletPage.tsx` accessible from user Dashboard:
  - Shows total wallet balance (walletBalance + commissionBalance combined display, or separate card)
  - Shows joining bonus badge "Rs.150 Joining Bonus Credited" for approved users
  - Withdrawal request form: amount field (min Rs.500), UPI ID text field, submit button
  - Shows user's past withdrawal requests with status badges
- New `PageName` values: `"wallet"` and `"admin-withdrawals"`
- New admin page `AdminWithdrawalsPage.tsx`:
  - Lists all pending withdrawal requests with user name, mobile, amount, UPI ID
  - Approve / Reject buttons per request
  - On approve: deduct amount from user's walletBalance in store, mark request approved
  - Shows approved/rejected history too (tabs: All / Pending / Approved / Rejected)
- Navigation: Dashboard "Quick Actions" gains a "My Wallet" button; Admin nav gets "Withdrawals" link

### Modify
- `types.ts`: add `walletBalance: number` to `User` interface; add `WithdrawalRequest` interface
- `store.ts` `approveUser()`: after setting status=approved, also set `user.walletBalance = (user.walletBalance ?? 0) + 150`
- `store.ts` `initializeStore()`: sample users should include `walletBalance` field (u1 = 150, u2 = 0)
- `App.tsx`: add `"wallet"` and `"admin-withdrawals"` to routing; render `WalletPage` and `AdminWithdrawalsPage`
- `Navbar.tsx`: add Wallet nav link for logged-in users; add Withdrawals link in admin nav
- `DashboardPage.tsx`: add "My Wallet" quick action card pointing to wallet page; update stats to show wallet balance separately

### Remove
- Nothing removed

## Implementation Plan
1. Update `types.ts`: add `walletBalance` to User, add `WithdrawalRequest` interface, add `"wallet"` and `"admin-withdrawals"` to PageName
2. Update `store.ts`: add WITHDRAWALS_KEY, withdrawal helpers, credit Rs.150 in approveUser, update sample users with walletBalance
3. Create `WalletPage.tsx`: wallet balance cards, joining bonus notice, withdrawal form (min Rs.500, UPI ID), withdrawal history list
4. Create `AdminWithdrawalsPage.tsx`: tabbed list, approve/reject actions that update user wallet balance
5. Update `App.tsx`: import and route new pages
6. Update `Navbar.tsx`: add Wallet link for users, Withdrawals link for admin
7. Update `DashboardPage.tsx`: add My Wallet quick action, show walletBalance stat card
