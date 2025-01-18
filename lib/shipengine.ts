import { ShipEngine } from 'shipengine';

if (!process.env.SHIPENGINE_API_KEY) {
  throw new Error('SHIPENGINE_API_KEY is not defined');
}

export const shipEngine = new ShipEngine(process.env.SHIPENGINE_API_KEY);

export const getShippingRates = async (address: any, packages: any[]) => {
  try {
    const response = await shipEngine.getRatesWithShipmentDetails({
      shipment: {
        shipTo: address,
        shipFrom: {
          name: "SHOP.CO",
          phone: "+1 555 123 4567",
          addressLine1: "123 Main St",
          cityLocality: "Austin",
          stateProvince: "TX",
          postalCode: "78701",
          countryCode: "US",
          addressResidentialIndicator: "no",
        },
        packages: packages,
      },
      rateOptions: {
        carrierIds: [
          process.env.SHIPENGINE_FIRST_COURIER || '',
          process.env.SHIPENGINE_SECOND_COURIER || '',
          process.env.SHIPENGINE_THIRD_COURIER || '',
          process.env.SHIPENGINE_FOURTH_COURIER || '',
        ].filter(Boolean),
      },
    });

    return response;
  } catch (error) {
    console.error('ShipEngine Error:', error);
    throw error;
  }
};

export const createShippingLabel = async (rateId: string) => {
  try {
    const label = await shipEngine.createLabelFromRate({
      rateId,
      validateAddress: 'no_validation',
      labelLayout: '4x6',
      labelFormat: 'pdf',
      labelDownloadType: 'url',
      displayScheme: 'label',
    });

    return label;
  } catch (error) {
    console.error('ShipEngine Error:', error);
    throw error;
  }
};

