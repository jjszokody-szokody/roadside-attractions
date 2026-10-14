// ============================================================================
// Roadside Gems: AFFILIATE CONFIG (the ONLY place affiliate IDs live)
// ----------------------------------------------------------------------------
// Replace each *_PLACEHOLDER value with your real ID once approved.
// While a value still contains "PLACEHOLDER" (or is empty), links still work
// as plain, non-affiliate searches; the ID parameter is simply left off.
//
//  Viator Partner Program     https://partnerresources.viator.com/  -> "pid" (e.g. P00123456) and "mcid"
//  GetYourGuide Partners      https://partner.getyourguide.com/     -> "partner_id"
//  Booking.com Affiliate      https://www.booking.com/affiliate-program/v2/index.html -> "aid"
//  Expedia Group Affiliate    https://www.expediagroup.com/partners/affiliate-program/ (Creator/affiliate program)
//                             -> paste the tracking query string they give you (e.g. "affcid=XXXX&my_ad=YYYY")
// ============================================================================
window.AFFILIATE = {
  VIATOR_PID: 'VIATOR_PID_PLACEHOLDER',             // Viator partner ID, e.g. 'P00123456'
  VIATOR_MCID: 'VIATOR_MCID_PLACEHOLDER',           // Viator campaign ID, e.g. '42383'
  GETYOURGUIDE_PARTNER_ID: 'GYG_PARTNER_ID_PLACEHOLDER', // e.g. 'ABC123'
  BOOKING_AID: 'BOOKING_AID_PLACEHOLDER',           // Booking.com affiliate ID, e.g. '1234567'
  EXPEDIA_PARAMS: 'EXPEDIA_PARAMS_PLACEHOLDER'      // raw query string from Expedia, e.g. 'affcid=XXXX'
};

// Builds the outbound links. Unset/placeholder IDs are omitted automatically.
window.affiliateLinks = function (x, place) {
  const A = window.AFFILIATE || {}, ok = v => v && !/PLACEHOLDER/.test(v), e = encodeURIComponent;
  const where = (place || '').trim(), q = where ? x.name + ' ' + where : x.name;
  const near = where || (x.lat.toFixed(4) + ',' + x.lon.toFixed(4));
  const qs = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => k + '=' + e(v)).join('&');
  const viator = 'https://www.viator.com/searchResults/all?' + qs({ text: where || x.name,
    pid: ok(A.VIATOR_PID) ? A.VIATOR_PID : undefined, mcid: ok(A.VIATOR_MCID) && ok(A.VIATOR_PID) ? A.VIATOR_MCID : undefined,
    medium: ok(A.VIATOR_PID) ? 'link' : undefined });
  const gyg = 'https://www.getyourguide.com/s/?' + qs({ q: where || q, partner_id: ok(A.GETYOURGUIDE_PARTNER_ID) ? A.GETYOURGUIDE_PARTNER_ID : undefined });
  const booking = 'https://www.booking.com/searchresults.html?' + qs({ ss: near, latitude: x.lat, longitude: x.lon,
    aid: ok(A.BOOKING_AID) ? A.BOOKING_AID : undefined });
  let expedia = 'https://www.expedia.com/Hotel-Search?' + qs({ destination: near, latLong: x.lat + ',' + x.lon });
  if (ok(A.EXPEDIA_PARAMS)) expedia += '&' + A.EXPEDIA_PARAMS.replace(/^[?&]/, '');
  return {
    tours: [[viator, '🎟️ Tours on Viator'], [gyg, '🧭 Tours on GetYourGuide']],
    stays: [[booking, '🏨 Booking.com'], [expedia, '🛏️ Expedia']]
  };
};
