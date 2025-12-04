// shared/businessConfig.js - Configuration des valeurs business réelles

// VALEURS BUSINESS OFFICIELLES
export const BUSINESS_VALUES = {
  // Prix et marge
  product_price: 729,           // Prix de vente réel (corrigé)
  old_price: 1038,             // Ancien prix pour calcul de réduction
  profit_margin: 0.28,         // 28% de marge réelle
  conversion_rate: 0.40,       // 40% des leads deviennent des ventes
  
  // Valeurs calculées
  estimated_profit: 204.12,    // 729 * 0.28
  lead_value: 81.65,          // 729 * 0.28 * 0.40 (valeur estimée par lead)
  
  // Réductions
  discount_percentage: 30,     // 30% de réduction
  savings_amount: 309,         // 1038 - 729
  
  // Métadonnées
  currency: 'MAD',
  product_name: 'Coiffeuse de Maquillage Élégante',
  category: 'Meubles de Salle de Bain'
};

// ÉVÉNEMENTS FACEBOOK AVEC VALEURS BUSINESS
export const PIXEL_EVENTS = {
  // Événement standard avec prix de vente
  PURCHASE: {
    value: BUSINESS_VALUES.product_price,
    currency: BUSINESS_VALUES.currency,
    content_name: BUSINESS_VALUES.product_name,
    content_category: BUSINESS_VALUES.category,
    content_ids: ['coiffeuse_makiage_premium'],
    content_type: 'product'
  },
  
  // Événement business avec valeur profit réelle
  PURCHASE_PROFIT: {
    value: BUSINESS_VALUES.estimated_profit,
    currency: BUSINESS_VALUES.currency,
    content_name: BUSINESS_VALUES.product_name + ' - Profit',
    profit_margin: BUSINESS_VALUES.profit_margin,
    business_value: BUSINESS_VALUES.estimated_profit
  },
  
  // Événement pour optimisation lead
  LEAD_VALUE: {
    value: BUSINESS_VALUES.lead_value,
    currency: BUSINESS_VALUES.currency,
    content_name: BUSINESS_VALUES.product_name + ' - Lead Value',
    predicted_ltv: BUSINESS_VALUES.lead_value,
    conversion_probability: BUSINESS_VALUES.conversion_rate
  }
};

// CAPI Configuration
export const CAPI_CONFIG = {
  pixel_id: "1066979964758813",
  access_token: "VOTRE_JETON_D'ACCÈS_CAPI_ICI", // À configurer
  test_code: "", // Pour les tests uniquement
  
  // Événements CAPI avec valeurs business
  getCapiEventData: (eventType, userData = {}) => {
    const baseData = {
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: window?.location?.href || '',
      user_data: userData
    };
    
    switch (eventType) {
      case 'Purchase':
        return {
          ...baseData,
          event_name: 'Purchase',
          custom_data: PIXEL_EVENTS.PURCHASE
        };
        
      case 'PurchaseProfit':
        return {
          ...baseData,
          event_name: 'PurchaseProfit',
          custom_data: PIXEL_EVENTS.PURCHASE_PROFIT
        };
        
      case 'LeadValue':
        return {
          ...baseData,
          event_name: 'LeadValue',
          custom_data: PIXEL_EVENTS.LEAD_VALUE
        };
        
      default:
        return baseData;
    }
  }
};

// MÉTRIQUES ROI CALCULÉES
export const ROI_METRICS = {
  // Coût maximum par lead pour être rentable
  max_cost_per_lead: BUSINESS_VALUES.lead_value * 0.8, // 80% de la valeur lead
  
  // Coût maximum par acquisition
  max_cost_per_acquisition: BUSINESS_VALUES.estimated_profit * 0.6, // 60% du profit
  
  // ROI target
  target_roas: 3.5, // Return on Ad Spend minimum
  
  // Customer Lifetime Value (projection 3 mois)
  customer_ltv_3m: BUSINESS_VALUES.estimated_profit * 1.2,
  
  // Calcul du ROI estimé
  calculateEstimatedROI: (adSpend, leads, conversions) => {
    const revenue = conversions * BUSINESS_VALUES.product_price;
    const profit = conversions * BUSINESS_VALUES.estimated_profit;
    const roi = profit / adSpend;
    const roas = revenue / adSpend;
    
    return {
      roi_percentage: (roi - 1) * 100,
      roas: roas,
      profit_generated: profit,
      revenue_generated: revenue,
      cost_per_lead: adSpend / leads,
      cost_per_acquisition: adSpend / conversions,
      is_profitable: roi > 1.2 // 20% minimum de ROI
    };
  }
};