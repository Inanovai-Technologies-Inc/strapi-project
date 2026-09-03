import type { Schema, Struct } from '@strapi/strapi';

export interface FooterOffice extends Struct.ComponentSchema {
  collectionName: 'components_footer_offices';
  info: {
    displayName: 'Office';
  };
  attributes: {
    City: Schema.Attribute.String;
    Country: Schema.Attribute.String;
    OfficeType: Schema.Attribute.String;
  };
}

export interface FooterSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_footer_social_links';
  info: {
    displayName: 'Social Links';
  };
  attributes: {
    Facebook: Schema.Attribute.String;
    LinkedIn: Schema.Attribute.String;
    YouTube: Schema.Attribute.String;
  };
}

export interface ProductFoamSkidSeries extends Struct.ComponentSchema {
  collectionName: 'components_product_foam_skid_series';
  info: {
    displayName: 'Foam Skid Series';
  };
  attributes: {
    SeriesCertificationLogos: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    SeriesDescription: Schema.Attribute.Blocks;
    SeriesImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios'
    >;
    SeriesName: Schema.Attribute.String;
  };
}

export interface SharedImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_images';
  info: {
    displayName: 'image';
    icon: 'picture';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSections extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    displayName: 'sections';
  };
  attributes: {
    content: Schema.Attribute.Blocks;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    imagePosition: Schema.Attribute.Enumeration<['left', 'right']>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedTechnicalSpecification extends Struct.ComponentSchema {
  collectionName: 'components_shared_technical_specifications';
  info: {
    displayName: 'Technical Specification';
  };
  attributes: {
    Label: Schema.Attribute.String;
    Value: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'footer.office': FooterOffice;
      'footer.social-links': FooterSocialLinks;
      'product.foam-skid-series': ProductFoamSkidSeries;
      'shared.image': SharedImage;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.sections': SharedSections;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.technical-specification': SharedTechnicalSpecification;
    }
  }
}
