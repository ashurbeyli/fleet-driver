export type Language = 'tr' | 'en';

export interface Translations {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    back: string;
    continue: string;
    tryAgain: string;
    logout: string;
    bonuses: string;
    challenges: string;
  };
  
  // Menu
  menu: {
    profile: string;
    agreement: string;
    vehicleChange: string;
    inviteFriend: string;
    language: string;
    logout: string;
    verified: string;
    notVerified: string;
  };
  
  // Withdrawal
  withdrawal: {
    title: string;
    amount: string;
    enterAmount: string;
    available: string;
    blocked: string;
    blockedBalanceInfo: string;
    total: string;
    continue: string;
    receiverName: string;
    iban: string;
    confirmWithdrawal: string;
    withdrawalSuccessful: string;
    withdrawalFailed: string;
    backToWithdraw: string;
    recentWithdrawals: string;
    noWithdrawalHistory: string;
    amountSent: string;
    balanceUpdateInfo: string;
    details: string;
    status: string;
    explanation: string;
    createdAt: string;
    updatedAt: string;
    yandexTransactionId: string;
    bankTransactionRefNo: string;
    bankPaymentNo: string;
    failureReason: string;
  };
  
  // OTP
  otp: {
    title: string;
    enterOtp: string;
    verify: string;
    resend: string;
    verifyWithdrawal: string;
    verificationMessage: string;
    invalidOtp: string;
    resendSuccess: string;
    resendFailed: string;
    verificationFailed: string;
    verifying: string;
    codeSentTo: string;
    yourPhone: string;
    resendCodeIn: string;
    resendCode: string;
    didntReceiveCode: string;
  };
  
  // Validation
  validation: {
    amountRequired: string;
    amountExceeded: string;
    amountWithCommissionExceeded: (amount: string, commission: string, available: string) => string;
    receiverNameRequired: string;
    receiverNameMinLength: string;
    ibanRequired: string;
    ibanInvalid: string;
    amountGreaterThanZero: string;
    amountMinimumWithdrawal: (minimum: string) => string;
    amountMaximumWithdrawal: (maximum: string) => string;
    amountExceedsDailyLimit: (limit: string) => string;
    amountInvalid: string;
    otpInvalidLength: string;
  };
  
  // Withdrawal Status
  withdrawalStatus: {
    completed: string;
    pending: string;
    failed: string;
    unknown: string;
  };
  
  // Withdrawal Details
  withdrawalDetails: {
    title: string;
    bankDetails: string;
    loadingBankDetails: string;
    withdrawalAmount: string;
    confirmWithdrawal: string;
    confirmMessage: (amount: string, receiverName: string) => string;
    commissionFee: string;
  };
  
  // Withdrawal Success
  withdrawalSuccess: {
    title: string;
    subtitle: string;
    amountSent: string;
    receiverName: string;
    iban: string;
  };
  
  // Withdrawal Error
  withdrawalError: {
    title: string;
    defaultMessage: string;
  };
  
  // Dashboard
  dashboard: {
    yourBalance: string;
    withdraw: string;
    home: string;
    menu: string;
  };
  
  // Common UI
  ui: {
    bankTransfer: string;
    loadingBalance: string;
    loadingHistory: string;
  };
  
  // Agreement
  agreement: {
    required: string;
    reviewMessage: string;
    reviewAgreement: string;
    loading: string;
    errorLoading: string;
    errorMessage: string;
    lastUpdated: string;
    contentTitle: string;
    contentSubtitle: string;
    readFull: string;
    hideFull: string;
    tapToRead: string;
    alreadyAgreed: string;
    iAgree: string;
    accepting: string;
    cancel: string;
    failedToLoad: string;
    failedToSendCode: string;
    invalidCode: string;
    failedToResend: string;
    unknownDate: string;
  };
  
  // Contact/Support
  contact: {
    support: string;
    getSupport: string;
    callSupport: string;
    whatsAppChat: string;
    whatsAppDescription: string;
    followUs: string;
    whatsAppMessage: string;
    phoneNotSupported: string;
    unableToOpenPhone: string;
    unableToOpenWhatsApp: string;
    unableToOpenPlatform: string;
    platformNotConfigured: string;
    facebook: string;
    instagram: string;
    allRightsReserved: string;
  };
  
  // Profile
  profile: {
    driver: string;
    profileDetails: string;
    parkName: string;
    agreement: string;
    agreed: string;
    notAgreed: string;
    userInfo: string;
    loadingUserInfo: string;
    failedToLoadUserInfo: string;
    hireDate: string;
    phone: string;
    plateNumber: string;
    status: string;
    city: string;
  };
  
  // Login
  login: {
    controlCentre: string;
    yourPark: string;
    loadingParks: string;
    noParksAvailable: string;
    selectPark: string;
    phoneNumber: string;
    phonePlaceholder: string;
    loggingIn: string;
    continue: string;
    termsAgreement: string;
    failedToLoadParks: string;
    pleaseSelectPark: string;
    invalidPhoneNumber: string;
    parkNotFound: string;
    loginFailed: string;
    loginFailedConnection: string;
  };
  
  // Login OTP
  loginOtp: {
    invalidCode: string;
    parkInfoMissing: string;
    verificationFailed: string;
    resendFailed: string;
  };
  
  // Bonuses
  bonuses: {
    loading: string;
    failedToLoad: string;
    unclaimed: string;
    bonus: string;
    bonuses: string;
    achieved: string;
    claimed: string;
    claim: string;
    claimFailed: string;
    missingId: string;
    bonusClaimed: string;
    successfullyClaimed: string;
    failedToClaim: string;
    failedToClaimConnection: string;
    noBonusesAvailable: string;
    completeChallenges: string;
    comingSoon: string;
    comingSoonSubtitle: string;
  };
  
  // Challenges
  challenges: {
    goals: string;
    rankings: string;
    activeGoals: string;
    loadingGoals: string;
    failedToLoadGoals: string;
    noGoalsAvailable: string;
    checkBackLater: string;
    completed: string;
    moreRidesToGo: string;
    left: string;
    expired: string;
    bonus: string;
    leaderboard: string;
    rank: string;
    driver: string;
    orders: string;
    order: string;
    loadingLeaderboards: string;
    failedToLoadLeaderboards: string;
    noCompetitionsAvailable: string;
    noLeaderboardData: string;
    you: string;
    comingSoon: string;
    comingSoonSubtitle: string;
  };
}

export const translations: Record<Language, Translations> = {
  tr: {
    common: {
      loading: 'Yükleniyor...',
      error: 'Hata',
      success: 'Başarılı',
      cancel: 'İptal',
      confirm: 'Onayla',
      back: 'Geri',
      continue: 'Devam',
      tryAgain: 'Tekrar Dene',
      logout: 'Çıkış Yap',
      bonuses: 'Bonuslar',
      challenges: 'Kampaniyalar',
    },
    menu: {
      profile: 'Profil',
      agreement: 'Sözleşme',
      vehicleChange: 'Araç Değiştir',
      inviteFriend: 'Arkadaş Davet Et',
      language: 'Dil',
      logout: 'Çıkış Yap',
      verified: 'Doğrulandı',
      notVerified: 'Doğrulanmadı',
    },
    withdrawal: {
      title: 'Para Çekme',
      amount: 'Tutar',
      enterAmount: 'Tutar Girin',
      available: 'Çekilebilir',
      blocked: 'İncelemede',
      blockedBalanceInfo: 'Yandex tarafından verilen bonuslar, yolculukların inceleme süreci tamamlandıktan sonra onaylanır.',
      total: 'Toplam',
      continue: 'Devam',
      receiverName: 'Alıcı Adı',
      iban: 'IBAN',
      confirmWithdrawal: 'Para Çekmeyi Onayla',
      withdrawalSuccessful: 'Para Çekme Başarılı!',
      withdrawalFailed: 'Para Çekme Başarısız',
      backToWithdraw: 'Para Çekmeye Dön',
      recentWithdrawals: 'Son Para Çekmeler',
      noWithdrawalHistory: 'Para çekme geçmişi yok',
      amountSent: 'Gönderilen Tutar',
      balanceUpdateInfo: 'Bakiyeniz işlem tamamen tamamlandığında güncellenecektir.',
      details: 'Detaylar',
      status: 'Durum',
      explanation: 'Açıklama',
      createdAt: 'Oluşturulma Tarihi',
      updatedAt: 'Güncellenme Tarihi',
      yandexTransactionId: 'Yandex İşlem ID',
      bankTransactionRefNo: 'Banka İşlem Referans No',
      bankPaymentNo: 'Banka Ödeme No',
      failureReason: 'Hata Nedeni',
    },
    otp: {
      title: 'OTP Doğrulama',
      enterOtp: 'OTP Kodunu Girin',
      verify: 'Doğrula',
      resend: 'Yeniden Gönder',
      verifyWithdrawal: 'Para Çekmeyi Doğrula',
      verificationMessage: 'Lütfen telefonunuza gönderilen doğrulama kodunu girerek bu para çekme işlemini onaylayın.',
      invalidOtp: 'Geçersiz OTP kodu. Lütfen kontrol edip tekrar deneyin.',
      resendSuccess: 'Doğrulama kodu yeniden gönderildi.',
      resendFailed: 'Kod yeniden gönderilemedi. Lütfen tekrar deneyin.',
      verificationFailed: 'Doğrulama başarısız. Lütfen kodunuzu kontrol edip tekrar deneyin.',
      verifying: 'Doğrulanıyor...',
      codeSentTo: 'Kod gönderildi',
      yourPhone: 'telefonunuza',
      resendCodeIn: 'Kodu yeniden gönder',
      resendCode: 'Kodu Yeniden Gönder',
      didntReceiveCode: 'Kodu almadınız mı? Telefon mesajlarınızı kontrol edin veya yeniden göndermeyi deneyin.',
    },
    validation: {
      amountRequired: 'Tutar gerekli',
      amountExceeded: 'Girilmiş tutar çekilebilir bakiyeyi aşamaz',
      amountWithCommissionExceeded: (amount: string, commission: string, available: string) => `Tutar (₺${amount}) + komisyon ücreti (₺${commission}) çekilebilir bakiyeyi (₺${available}) aşamaz`,
      receiverNameRequired: 'Alıcı adı gerekli',
      receiverNameMinLength: 'Alıcı adı en az 2 karakter olmalıdır',
      ibanRequired: 'IBAN gerekli',
      ibanInvalid: 'IBAN 26 karakter uzunluğunda olmalı, TR ile başlamalı ve geri kalanı rakam olmalıdır',
      amountGreaterThanZero: 'Tutar 0\'dan büyük olmalıdır',
      amountMinimumWithdrawal: (minimum: string) => `Minimum para çekme tutarı ₺${minimum} olmalıdır`,
      amountMaximumWithdrawal: (maximum: string) => `Maksimum para çekme tutarı ₺${maximum} olmalıdır`,
      amountExceedsDailyLimit: (limit: string) => `Günlük kalan çekilebilir limitiniz ₺${limit}`,
      amountInvalid: 'Lütfen geçerli bir tutar girin',
      otpInvalidLength: 'Lütfen geçerli bir 6 haneli doğrulama kodu girin.',
    },
    withdrawalStatus: {
      completed: 'Tamamlandı',
      pending: 'Beklemede',
      failed: 'Başarısız',
      unknown: 'Bilinmiyor',
    },
    withdrawalDetails: {
      title: 'Para Çekme Detayları',
      bankDetails: 'Banka Detayları',
      loadingBankDetails: 'Banka detayları yükleniyor...',
      withdrawalAmount: 'Para Çekme Tutarı',
      confirmWithdrawal: 'Para Çekmeyi Onayla',
      confirmMessage: (amount: string, receiverName: string) => `₺${amount} tutarını ${receiverName} adına para çekmek istediğinizden emin misiniz?`,
      commissionFee: 'Komisyon Ücreti',
    },
    withdrawalSuccess: {
      title: 'Para Çekme Başarılı!',
      subtitle: 'Para çekme talebiniz işlendi ve para gönderildi.',
      amountSent: 'Gönderilen Tutar',
      receiverName: 'Alıcı Adı',
      iban: 'IBAN',
    },
    withdrawalError: {
      title: 'Para Çekme Başarısız',
      defaultMessage: 'Para çekme talebi başarısız oldu. Bu bir banka hatası veya dahili bir hata nedeniyle olabilir. Lütfen daha sonra tekrar deneyin.',
    },
    dashboard: {
      yourBalance: 'Bakiyeniz',
      withdraw: 'Para Çek',
      home: 'Ana Sayfa',
      menu: 'Menü',
    },
    ui: {
      bankTransfer: 'Banka Transferi',
      loadingBalance: 'Bakiye yükleniyor...',
      loadingHistory: 'Geçmiş yükleniyor...',
    },
    agreement: {
      required: 'Sözleşme Gerekli',
      reviewMessage: 'Lütfen hizmeti kullanmaya devam etmek için sözleşmeyi inceleyin ve onaylayın.',
      reviewAgreement: 'Sözleşmeyi İncele',
      loading: 'Sözleşme yükleniyor...',
      errorLoading: 'Sözleşme Yüklenirken Hata',
      errorMessage: 'Sözleşme yüklenemedi. Lütfen tekrar deneyin.',
      lastUpdated: 'Son güncelleme:',
      contentTitle: 'Sözleşme İçeriği',
      contentSubtitle: 'Lütfen kabul etmeden önce sözleşmenin tamamını okuyun',
      readFull: 'Tam Sözleşmeyi Oku',
      hideFull: 'Tam Sözleşmeyi Gizle',
      tapToRead: 'Tam sözleşmeyi okumak için dokunun',
      alreadyAgreed: 'Şartları ve koşulları zaten kabul ettiniz',
      iAgree: 'Şartları Kabul Ediyorum',
      accepting: 'Kabul ediliyor...',
      cancel: 'İptal',
      failedToLoad: 'Sözleşme yüklenemedi. Lütfen tekrar deneyin.',
      failedToSendCode: 'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.',
      invalidCode: 'Geçersiz doğrulama kodu. Lütfen tekrar deneyin.',
      failedToResend: 'Doğrulama kodu yeniden gönderilemedi. Lütfen tekrar deneyin.',
      unknownDate: 'Bilinmeyen tarih',
    },
    contact: {
      support: 'Destek',
      getSupport: 'Destek Al',
      callSupport: 'Telefon Desteği',
      whatsAppChat: 'WhatsApp Sohbet',
      whatsAppDescription: 'Destek ekibimizle sohbet edin',
      followUs: 'Bizi Takip Edin',
      whatsAppMessage: 'Merhaba, RidexGo uygulaması için destek istiyorum',
      phoneNotSupported: 'Bu cihazda telefon aramaları desteklenmiyor',
      unableToOpenPhone: 'Telefon arayıcısı açılamadı',
      unableToOpenWhatsApp: 'WhatsApp açılamadı',
      unableToOpenPlatform: 'Açılamadı',
      platformNotConfigured: 'bağlantısı yapılandırılmamış',
      facebook: 'Facebook',
      instagram: 'Instagram',
      allRightsReserved: '© 2024 RidexGo. Tüm hakları saklıdır.',
    },
    profile: {
      driver: 'Sürücü',
      profileDetails: 'Profil Detayları',
      parkName: 'Şehir',
      agreement: 'Sözleşme',
      agreed: '✓ Kabul Edildi',
      notAgreed: '✗ Kabul Edilmedi',
      userInfo: 'Kullanıcı Bilgileri',
      loadingUserInfo: 'Kullanıcı bilgileri yükleniyor...',
      failedToLoadUserInfo: 'Kullanıcı bilgileri yüklenemedi',
      hireDate: 'RidexGo\'da Başlama Tarihi',
      phone: 'Telefon',
      plateNumber: 'Araba plakası',
      status: 'Durum',
      city: 'Şehir',
    },
    login: {
      controlCentre: 'Kontrol Merkezi',
      yourPark: 'Çalıştığınız şehir',
      loadingParks: 'Parklar yükleniyor...',
      noParksAvailable: 'Park bulunamadı',
      selectPark: 'Çalıştığınız şehiri seçin',
      phoneNumber: 'Telefon Numarası',
      phonePlaceholder: '+994 70 422 06 92',
      loggingIn: 'Giriş yapılıyor...',
      continue: 'Devam',
      termsAgreement: 'Devam ederek Şartlar ve Gizlilik Politikamızı kabul etmiş olursunuz',
      failedToLoadParks: 'Parklar yüklenemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.',
      pleaseSelectPark: 'Lütfen bir park seçin',
      invalidPhoneNumber: 'Lütfen ülke kodu ile geçerli bir telefon numarası girin',
      parkNotFound: 'Seçilen park bulunamadı',
      loginFailed: 'Giriş başarısız. Lütfen tekrar deneyin.',
      loginFailedConnection: 'Giriş başarısız. Lütfen bağlantınızı kontrol edip tekrar deneyin.',
    },
    loginOtp: {
      invalidCode: 'Geçersiz doğrulama kodu. Lütfen tekrar deneyin.',
      parkInfoMissing: 'Park bilgisi eksik. Lütfen geri dönüp tekrar giriş yapın.',
      verificationFailed: 'Doğrulama başarısız. Lütfen kodunuzu kontrol edip tekrar deneyin.',
      resendFailed: 'Kod yeniden gönderilemedi. Lütfen tekrar deneyin.',
    },
    bonuses: {
      loading: 'Bonuslar yükleniyor...',
      failedToLoad: 'Bonuslar yüklenemedi. Lütfen tekrar deneyin.',
      unclaimed: 'Kullanılmamış',
      bonus: 'Bonus',
      bonuses: 'Bonuslar',
      achieved: 'Elde edildi',
      claimed: 'Kullanıldı',
      claim: 'Kullan',
      claimFailed: 'Kullanım Başarısız',
      missingId: 'Bu bonus kullanılamaz. Bonus ID eksik.',
      bonusClaimed: 'Bonus Kullanıldı!',
      successfullyClaimed: ' başarıyla kullanıldı!',
      failedToClaim: 'Bonus kullanılamadı. Lütfen tekrar deneyin.',
      failedToClaimConnection: 'Bonus kullanılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.',
      noBonusesAvailable: 'Mevcut bonus yok',
      completeChallenges: 'Bonuslar kazanmak için kampaniyaları ve referansları tamamlayın',
      comingSoon: 'Bu özellik yakında gelecek',
      comingSoonSubtitle: 'Lütfen daha sonra tekrar kontrol edin',
    },
    challenges: {
      goals: 'Kampaniyalar',
      rankings: 'Sıralama',
      activeGoals: 'Aktif Kampaniyalar',
      loadingGoals: 'Kampaniyalar yükleniyor...',
      failedToLoadGoals: 'Kampaniyalar yüklenemedi. Lütfen tekrar deneyin.',
      noGoalsAvailable: 'Mevcut kampaniya yok',
      checkBackLater: 'Yeni kampaniyalar için daha sonra tekrar kontrol edin',
      completed: 'Kampaniya tamamlandı!',
      moreRidesToGo: ' daha yolculuk kaldı',
      left: ' kaldı',
      expired: 'Süresi doldu',
      bonus: 'Bonus:',
      leaderboard: 'Liderlik Tablosu',
      rank: 'Sıra',
      driver: 'Sürücü',
      orders: 'Siparişler',
      order: 'sipariş',
      loadingLeaderboards: 'Liderlik tablosu yükleniyor...',
      failedToLoadLeaderboards: 'Liderlik tablosu yüklenemedi. Lütfen tekrar deneyin.',
      noCompetitionsAvailable: 'Mevcut yarışma yok',
      noLeaderboardData: 'Liderlik tablosu verisi mevcut değil',
      you: 'Sen',
      comingSoon: 'Bu özellik yakında gelecek',
      comingSoonSubtitle: 'Lütfen daha sonra tekrar kontrol edin',
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      back: 'Back',
      continue: 'Continue',
      tryAgain: 'Try Again',
      logout: 'Logout',
      bonuses: 'Bonuses',
      challenges: 'Challenges',
    },
    menu: {
      profile: 'Profile',
      agreement: 'Agreement',
      vehicleChange: 'Vehicle Change',
      inviteFriend: 'Invite a friend',
      language: 'Language',
      logout: 'Logout',
      verified: 'Verified',
      notVerified: 'Not Verified',
    },
    withdrawal: {
      title: 'Withdraw',
      amount: 'Amount',
      enterAmount: 'Enter Amount',
      available: 'Available',
      blocked: 'Blocked',
      blockedBalanceInfo: 'Under Yandex review',
      total: 'Total',
      continue: 'Continue',
      receiverName: 'Receiver Name',
      iban: 'IBAN',
      confirmWithdrawal: 'Confirm Withdrawal',
      withdrawalSuccessful: 'Withdrawal Successful!',
      withdrawalFailed: 'Withdrawal Failed',
      backToWithdraw: 'Back to Withdraw',
      recentWithdrawals: 'Recent Withdrawals',
      noWithdrawalHistory: 'No withdrawal history',
      amountSent: 'Amount Sent',
      balanceUpdateInfo: 'Your balance will update once the transaction is fully processed.',
      details: 'Details',
      status: 'Status',
      explanation: 'Explanation',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      yandexTransactionId: 'Yandex Transaction ID',
      bankTransactionRefNo: 'Bank Transaction Ref No',
      bankPaymentNo: 'Bank Payment No',
      failureReason: 'Failure Reason',
    },
    otp: {
      title: 'OTP Verification',
      enterOtp: 'Enter OTP Code',
      verify: 'Verify',
      resend: 'Resend',
      verifyWithdrawal: 'Verify Withdrawal',
      verificationMessage: 'Please enter the verification code sent to your phone to confirm this withdrawal.',
      invalidOtp: 'Invalid OTP code. Please check and try again.',
      resendSuccess: 'Verification code has been resent.',
      resendFailed: 'Failed to resend code. Please try again.',
      verificationFailed: 'Verification failed. Please check your code and try again.',
      verifying: 'Verifying...',
      codeSentTo: 'Code sent to',
      yourPhone: 'your phone',
      resendCodeIn: 'Resend code in',
      resendCode: 'Resend Code',
      didntReceiveCode: 'Didn\'t receive the code? Check your phone messages or try resending.',
    },
    validation: {
      amountRequired: 'Amount is required',
      amountExceeded: 'Cannot exceed available balance',
      amountWithCommissionExceeded: (amount: string, commission: string, available: string) => `Amount (₺${amount}) + commission fee (₺${commission}) cannot exceed available balance (₺${available})`,
      receiverNameRequired: 'Receiver name is required',
      receiverNameMinLength: 'Receiver name must be at least 2 characters long',
      ibanRequired: 'IBAN is required',
      ibanInvalid: 'IBAN must be 26 characters long, start with TR, and the rest must be numbers',
      amountGreaterThanZero: 'Amount must be greater than 0',
      amountMinimumWithdrawal: (minimum: string) => `Minimum withdrawal amount must be ₺${minimum}`,
      amountMaximumWithdrawal: (maximum: string) => `Maximum withdrawal amount must be ₺${maximum}`,
      amountExceedsDailyLimit: (limit: string) => `Your remaining daily withdrawal limit is ₺${limit}`,
      amountInvalid: 'Please enter a valid amount',
      otpInvalidLength: 'Please enter a valid 6-digit verification code.',
    },
    withdrawalStatus: {
      completed: 'Completed',
      pending: 'Pending',
      failed: 'Failed',
      unknown: 'Unknown',
    },
    withdrawalDetails: {
      title: 'Withdrawal Details',
      bankDetails: 'Bank Details',
      loadingBankDetails: 'Loading bank details...',
      withdrawalAmount: 'Withdrawal Amount',
      confirmWithdrawal: 'Confirm Withdrawal',
      confirmMessage: (amount: string, receiverName: string) => `Are you sure you want to withdraw ₺${amount} to ${receiverName}?`,
      commissionFee: 'Commission Fee',
    },
    withdrawalSuccess: {
      title: 'Withdrawal Successful!',
      subtitle: 'Your withdrawal request has been processed and the money has been sent.',
      amountSent: 'Amount Sent',
      receiverName: 'Receiver Name',
      iban: 'IBAN',
    },
    withdrawalError: {
      title: 'Withdrawal Failed',
      defaultMessage: 'The withdrawal request failed. This could be due to a bank error or internal failure. Please try again later.',
    },
    dashboard: {
      yourBalance: 'Your Balance',
      withdraw: 'Withdraw',
      home: 'Home',
      menu: 'Menu',
    },
    ui: {
      bankTransfer: 'Bank Transfer',
      loadingBalance: 'Loading balance...',
      loadingHistory: 'Loading history...',
    },
    agreement: {
      required: 'Agreement Required',
      reviewMessage: 'Please review and approve the agreement to continue using the service.',
      reviewAgreement: 'Review Agreement',
      loading: 'Loading agreement...',
      errorLoading: 'Error Loading Agreement',
      errorMessage: 'Failed to load agreement. Please try again.',
      lastUpdated: 'Last updated:',
      contentTitle: 'Agreement Content',
      contentSubtitle: 'Please read the full agreement before accepting',
      readFull: 'Read Full Agreement',
      hideFull: 'Hide Full Agreement',
      tapToRead: 'Tap to read complete agreement',
      alreadyAgreed: 'You have already agreed to the terms and conditions',
      iAgree: 'I Agree to the Terms',
      accepting: 'Accepting...',
      cancel: 'Cancel',
      failedToLoad: 'Failed to load agreement. Please try again.',
      failedToSendCode: 'Failed to send verification code. Please try again.',
      invalidCode: 'Invalid verification code. Please try again.',
      failedToResend: 'Failed to resend verification code. Please try again.',
      unknownDate: 'Unknown date',
    },
    contact: {
      support: 'Support',
      getSupport: 'Get Support',
      callSupport: 'Call Support',
      whatsAppChat: 'WhatsApp Chat',
      whatsAppDescription: 'Chat with our support team',
      followUs: 'Follow Us',
      whatsAppMessage: 'Hello, I need support with RidexGo app',
      phoneNotSupported: 'Phone calls are not supported on this device',
      unableToOpenPhone: 'Unable to open phone dialer',
      unableToOpenWhatsApp: 'Unable to open WhatsApp',
      unableToOpenPlatform: 'Unable to open',
      platformNotConfigured: 'link is not configured',
      facebook: 'Facebook',
      instagram: 'Instagram',
      allRightsReserved: '© 2024 RidexGo. All rights reserved.',
    },
    profile: {
      driver: 'Driver',
      profileDetails: 'Profile Details',
      parkName: 'Park Name',
      agreement: 'Agreement',
      agreed: '✓ Agreed',
      notAgreed: '✗ Not Agreed',
      userInfo: 'User Info',
      loadingUserInfo: 'Loading user info...',
      failedToLoadUserInfo: 'Failed to load user info',
      hireDate: 'Hire Date',
      phone: 'Phone',
      plateNumber: 'Plate Number',
      status: 'Status',
      city: 'City',
    },
    login: {
      controlCentre: 'Control Centre',
      yourPark: 'Your Park',
      loadingParks: 'Loading parks...',
      noParksAvailable: 'No parks available',
      selectPark: 'Select your park',
      phoneNumber: 'Phone Number',
      phonePlaceholder: '+994 70 422 06 92',
      loggingIn: 'Logging in...',
      continue: 'Continue',
      termsAgreement: 'By continuing, you agree to our Terms & Privacy Policy',
      failedToLoadParks: 'Failed to load parks. Please check your connection and try again.',
      pleaseSelectPark: 'Please select a park',
      invalidPhoneNumber: 'Please enter a valid phone number with country code',
      parkNotFound: 'Selected park not found',
      loginFailed: 'Login failed. Please try again.',
      loginFailedConnection: 'Login failed. Please check your connection and try again.',
    },
    loginOtp: {
      invalidCode: 'Invalid verification code. Please try again.',
      parkInfoMissing: 'Park information is missing. Please go back and login again.',
      verificationFailed: 'Verification failed. Please check your code and try again.',
      resendFailed: 'Failed to resend code. Please try again.',
    },
    bonuses: {
      loading: 'Loading bonuses...',
      failedToLoad: 'Failed to load bonuses. Please try again.',
      unclaimed: 'Unclaimed',
      bonus: 'Bonus',
      bonuses: 'Bonuses',
      achieved: 'Achieved',
      claimed: 'Claimed',
      claim: 'Claim',
      claimFailed: 'Claim Failed',
      missingId: 'This bonus cannot be claimed. Missing bonus ID.',
      bonusClaimed: 'Bonus Claimed!',
      successfullyClaimed: ' successfully claimed!',
      failedToClaim: 'Failed to claim bonus. Please try again.',
      failedToClaimConnection: 'Failed to claim bonus. Please check your connection and try again.',
      noBonusesAvailable: 'No bonuses available',
      comingSoon: 'This Feature is Coming Soon',
      comingSoonSubtitle: 'Please check back later',
      completeChallenges: 'Complete challenges and referrals to earn bonuses',
    },
    challenges: {
      goals: 'Goals',
      rankings: 'Rankings',
      activeGoals: 'Active Goals',
      loadingGoals: 'Loading goals...',
      failedToLoadGoals: 'Failed to load goals. Please try again.',
      noGoalsAvailable: 'No goals available',
      checkBackLater: 'Check back later for new goals',
      completed: 'Challenge completed!',
      moreRidesToGo: ' more rides to go',
      left: ' left',
      expired: 'Expired',
      bonus: 'Bonus:',
      leaderboard: 'Leaderboard',
      rank: 'Rank',
      driver: 'Driver',
      orders: 'orders',
      order: 'order',
      loadingLeaderboards: 'Loading leaderboards...',
      failedToLoadLeaderboards: 'Failed to load leaderboards. Please try again.',
      noCompetitionsAvailable: 'No competitions available',
      noLeaderboardData: 'No leaderboard data available',
      you: 'You',
      comingSoon: 'This Feature is Coming Soon',
      comingSoonSubtitle: 'Please check back later',
    },
  },
};

