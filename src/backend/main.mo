import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Prim "mo:prim";

actor Main {

  public type UserStatus = { #pending; #approved; #rejected };
  public type PaymentStatus = { #none_; #pending; #confirmed; #rejected };

  public type User = {
    id : Text;
    name : Text;
    mobile : Text;
    email : Text;
    referralCode : Text;
    referredBy : ?Text;
    status : UserStatus;
    paymentStatus : PaymentStatus;
    utrNumber : ?Text;
    joinedAt : Nat64;
    commissionBalance : Nat;
    matrixLevel : ?Nat;
  };

  public type Commission = {
    id : Text;
    toUserId : Text;
    fromUserId : Text;
    level : Nat;
    amount : Nat;
    date : Nat64;
  };

  public type Video = {
    id : Text;
    title : Text;
    category : Text;
    url : Text;
    thumbnail : Text;
    description : Text;
  };

  public type Stats = {
    totalUsers : Nat;
    pendingUsers : Nat;
    approvedUsers : Nat;
    totalRevenue : Nat;
  };

  var users : Map.Map<Text, User> = Map.empty<Text, User>();
  var commissions : [Commission] = [];
  var videos : [Video] = [];
  var counter : Nat = 1;

  func nextId() : Text {
    let id = counter;
    counter += 1;
    id.toText()
  };

  func findByMobile(mobile : Text) : ?User {
    for ((_, u) in users.entries()) {
      if (u.mobile == mobile) return ?u;
    };
    null
  };

  func findByReferralCode(code : Text) : ?User {
    for ((_, u) in users.entries()) {
      if (u.referralCode == code) return ?u;
    };
    null
  };

  func copyUserWithStatus(u : User, s : UserStatus) : User = {
    id = u.id; name = u.name; mobile = u.mobile; email = u.email;
    referralCode = u.referralCode; referredBy = u.referredBy;
    status = s; paymentStatus = u.paymentStatus; utrNumber = u.utrNumber;
    joinedAt = u.joinedAt; commissionBalance = u.commissionBalance; matrixLevel = u.matrixLevel
  };

  func copyUserWithPay(u : User, ps : PaymentStatus, utr : ?Text) : User = {
    id = u.id; name = u.name; mobile = u.mobile; email = u.email;
    referralCode = u.referralCode; referredBy = u.referredBy;
    status = u.status; paymentStatus = ps; utrNumber = utr;
    joinedAt = u.joinedAt; commissionBalance = u.commissionBalance; matrixLevel = u.matrixLevel
  };

  public func registerUser(name : Text, mobile : Text, email : Text, referredBy : ?Text)
      : async { #ok : User; #err : Text } {
    switch (findByMobile(mobile)) {
      case (?_) return #err("Mobile already registered");
      case (null) {};
    };
    switch (referredBy) {
      case (?code) {
        switch (findByReferralCode(code)) {
          case (null) return #err("Invalid referral code");
          case (?_) {};
        };
      };
      case (null) {};
    };
    let id = nextId();
    let chars = name.chars().toArray();
    let prefix : Text = if (chars.size() >= 4) {
      Prim.charToText(chars[0]) # Prim.charToText(chars[1]) #
      Prim.charToText(chars[2]) # Prim.charToText(chars[3])
    } else { name };
    let user : User = {
      id; name; mobile; email;
      referralCode = prefix # id;
      referredBy; status = #pending; paymentStatus = #none_;
      utrNumber = null; joinedAt = Prim.time();
      commissionBalance = 0; matrixLevel = null;
    };
    users.add(id, user);
    #ok(user)
  };

  public func submitPaymentProof(userId : Text, utrNumber : Text) : async { #ok; #err : Text } {
    switch (users.get(userId)) {
      case (null) #err("User not found");
      case (?u) { users.add(userId, copyUserWithPay(u, #pending, ?utrNumber)); #ok };
    }
  };

  public query func getUserById(userId : Text) : async ?User { users.get(userId) };

  public query func getUserByMobile(mobile : Text) : async ?User { findByMobile(mobile) };

  public query func getVideos() : async [Video] { videos };

  public query func getCommissionsForUser(userId : Text) : async [Commission] {
    commissions.filter(func(c : Commission) : Bool { c.toUserId == userId })
  };

  public query func getStats() : async Stats {
    var total = 0; var pending = 0; var approved = 0;
    for ((_, u) in users.entries()) {
      total += 1;
      switch (u.status) {
        case (#pending) pending += 1;
        case (#approved) approved += 1;
        case (#rejected) {};
      };
    };
    { totalUsers = total; pendingUsers = pending; approvedUsers = approved; totalRevenue = approved * 118 }
  };

  public func adminGetAllUsers() : async [User] {
    var result : [User] = [];
    for ((_, u) in users.entries()) { result := result.concat([u]) };
    result
  };

  public func adminApproveUser(userId : Text) : async { #ok; #err : Text } {
    switch (users.get(userId)) {
      case (null) #err("User not found");
      case (?u) {
        let lvl : ?Nat = switch (u.referredBy) {
          case (null) ?1;
          case (?code) switch (findByReferralCode(code)) {
            case (null) ?1;
            case (?ref) switch (ref.matrixLevel) {
              case (null) ?1;
              case (?l) if (l < 3) ?(l + 1) else ?3;
            };
          };
        };
        let ps : PaymentStatus = if (u.paymentStatus == #pending) #confirmed else u.paymentStatus;
        users.add(userId, {
          id = u.id; name = u.name; mobile = u.mobile; email = u.email;
          referralCode = u.referralCode; referredBy = u.referredBy;
          status = #approved; paymentStatus = ps; utrNumber = u.utrNumber;
          joinedAt = u.joinedAt; commissionBalance = u.commissionBalance; matrixLevel = lvl
        });
        var curCode = u.referredBy;
        var level : Nat = 1;
        label commLoop while (level <= 3) {
          switch (curCode) {
            case (null) break commLoop;
            case (?code) {
              switch (findByReferralCode(code)) {
                case (null) break commLoop;
                case (?anc) {
                  let amt : Nat = if (level == 1) 10 else if (level == 2) 5 else 3;
                  commissions := commissions.concat([{
                    id = nextId(); toUserId = anc.id; fromUserId = userId;
                    level; amount = amt; date = Prim.time()
                  }]);
                  switch (users.get(anc.id)) {
                    case (null) {};
                    case (?a) users.add(a.id, {
                      id = a.id; name = a.name; mobile = a.mobile; email = a.email;
                      referralCode = a.referralCode; referredBy = a.referredBy;
                      status = a.status; paymentStatus = a.paymentStatus;
                      utrNumber = a.utrNumber; joinedAt = a.joinedAt;
                      commissionBalance = a.commissionBalance + amt; matrixLevel = a.matrixLevel
                    });
                  };
                  curCode := anc.referredBy;
                  level += 1;
                };
              };
            };
          };
        };
        #ok
      };
    }
  };

  public func adminRejectUser(userId : Text) : async { #ok; #err : Text } {
    switch (users.get(userId)) {
      case (null) #err("User not found");
      case (?u) { users.add(userId, copyUserWithStatus(u, #rejected)); #ok };
    }
  };

  public func adminRemoveUser(userId : Text) : async { #ok; #err : Text } {
    switch (users.get(userId)) {
      case (null) #err("User not found");
      case (?_) { users.remove(userId); #ok };
    }
  };

  public func adminConfirmPayment(userId : Text, utrRef : ?Text) : async { #ok; #err : Text } {
    switch (users.get(userId)) {
      case (null) #err("User not found");
      case (?u) {
        let utr = switch (utrRef) { case (?r) ?r; case (null) u.utrNumber };
        users.add(userId, copyUserWithPay(u, #confirmed, utr));
        #ok
      };
    }
  };

  public func adminRejectPayment(userId : Text) : async { #ok; #err : Text } {
    switch (users.get(userId)) {
      case (null) #err("User not found");
      case (?u) { users.add(userId, copyUserWithPay(u, #rejected, u.utrNumber)); #ok };
    }
  };

  public func adminAddVideo(title : Text, category : Text, url : Text, thumbnail : Text, description : Text) : async Video {
    let v : Video = { id = nextId(); title; category; url; thumbnail; description };
    videos := videos.concat([v]);
    v
  };

  public func adminRemoveVideo(videoId : Text) : async { #ok; #err : Text } {
    let filtered = videos.filter(func(v : Video) : Bool { v.id != videoId });
    if (filtered.size() == videos.size()) #err("Video not found")
    else { videos := filtered; #ok }
  };
};
