// Email generation utilities

export const emailTemplates = {
  welcome: {
    name: 'Welcome Sequence',
    description: 'Greet new subscribers',
    template: (name, brand) => `
Subject: Welcome to ${brand}!

Hi ${name},

Welcome aboard! We're thrilled to have you join our community.

Over the coming days, we'll share:
• Insider tips and tricks
• Exclusive offers
• Behind-the-scenes updates

Stay tuned!

Best regards,
${brand} Team
    `,
  },
  promotion: {
    name: 'Special Promotion',
    description: 'Drive sales with limited-time offers',
    template: (discount, offer, expiry) => `
Subject: 🎉 ${discount}% Off - Limited Time Only!

Hi there,

We're running a special promotion just for you:

${offer}

Use code SPECIAL${discount} at checkout
Valid until ${expiry}

Don't miss out!

Best regards,
The Team
    `,
  },
  retention: {
    name: 'Re-engagement',
    description: 'Win back inactive customers',
    template: (name, incentive) => `
Subject: We miss you, ${name}!

Hi ${name},

It's been a while since we've seen you. We'd love to have you back!

As a special welcome-back offer:
${incentive}

Come back and see what's new.

Best regards,
The Team
    `,
  },
  followUp: {
    name: 'Follow-up',
    description: 'Continue conversations',
    template: (name, topic) => `
Subject: Quick follow-up on ${topic}

Hi ${name},

I wanted to reach out and follow up on our recent conversation about ${topic}.

Would you be available for a brief chat this week?

Looking forward to connecting!

Best regards,
The Team
    `,
  },
  announcement: {
    name: 'Product Announcement',
    description: 'Introduce new features or products',
    template: (product, feature, link) => `
Subject: Introducing ${product} - ${feature}

Hi there,

We're excited to announce a major update!

${product}: ${feature}

Learn more: ${link}

Best regards,
The Team
    `,
  },
};

export const generateEmail = (templateType, ...params) => {
  const template = emailTemplates[templateType];
  if (!template) {
    return 'Template not found';
  }
  return template.template(...params);
};

export const getTemplateList = () => {
  return Object.entries(emailTemplates).map(([key, value]) => ({
    id: key,
    name: value.name,
    description: value.description,
  }));
};

export const copyToClipboard = (text) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return true;
  }
  return false;
};
