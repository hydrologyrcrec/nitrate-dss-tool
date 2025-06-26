// Google Drive links for Excel files - CLEANED UP
export const excelLinks = {
    calibration: 'https://docs.google.com/spreadsheets/d/175ex1CvdwvZDivJEmDpACAjtiv7vtdti/edit?usp=sharing&ouid=100448471119553937842&rtpof=true&sd=true',
    validation: 'https://docs.google.com/spreadsheets/d/1q9kC2yq43Ny3kaW-aI0KIB-kyNHTSdrj/edit?usp=sharing&ouid=100448471119553937842&rtpof=true&sd=true',
    transient: 'https://docs.google.com/spreadsheets/d/1RS4yEa7PnYqwsS5O_hrACBUn8Xs9K6N4/edit?usp=sharing&ouid=100448471119553937842&rtpof=true&sd=true',
    quality: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit?usp=sharing&ouid=100448471119553937842&rtpof=true&sd=true',
  } as const;

  // Updated Water Quality Data Links - Multi-Sheet Structure
export const waterQualityPointData: Record<WaterQualityPointKeys, WaterQualityPoint> = {
    'SW1': {
      name: 'SW1',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=80388670',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=80388670',
      description: 'High nitrate levels (6-7 mg/L)',
      status: 'Active Monitoring'
    },
    'SW2': {
      name: 'SW2',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1395270900',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1395270900',
      description: 'High nitrate levels (4-7 mg/L)',
      status: 'Active Monitoring'
    },
    'SW4': {
      name: 'SW4',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=45723149',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=45723149',
      description: 'Low nitrate levels',
      status: 'Active Monitoring'
    },
    'SW5': {
      name: 'SW5',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1738159344',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1738159344',
      description: 'Very low nitrate levels',
      status: 'Active Monitoring'
    },
    'SW6': {
      name: 'SW6',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1101431023',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1101431023',
      description: 'Low nitrate levels',
      status: 'Active Monitoring'
    },
    'SW7': {
      name: 'SW7',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1996146960',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1996146960',
      description: 'Very low nitrate levels',
      status: 'Active Monitoring'
    },
    'SW8': {
      name: 'SW8',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=835797608',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=835797608',
      description: 'Very low nitrate levels',
      status: 'Active Monitoring'
    },
    'SW9': {
      name: 'SW9',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=512927320',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=512927320',
      description: 'Very low nitrate levels',
      status: 'Active Monitoring'
    },
    'SW10': {
      name: 'SW10',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=196383291',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=196383291',
      description: 'Very low nitrate levels',
      status: 'Active Monitoring'
    },
    'Grove': {
      name: 'Grove',
      viewLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/edit#gid=1066857637',
      downloadLink: 'https://docs.google.com/spreadsheets/d/16i-uDK0-SW074rWMMyy2JFHV5VxTQkJ8/export?format=xlsx&gid=1066857637',
      description: 'Very low nitrate levels',
      status: 'Active Monitoring'
    }
  };


export const fsmTiffFiles = [
    {label: 'Drainage', file: 'Drainage_cog.tif'},
    {label: 'Flood Inventory', file: 'Flood_inventory_map_cog.tif'},
    {label: 'Slope', file: 'Slope_cog.tif'},
    {label: 'Lithology', file: 'Lithology_cog.tif'},
    {label: 'Urban', file: 'Urban_cog.tif'},
    {label: 'Soil', file: 'Soil_cog.tif'},
    {label: 'Water', file: 'Water_cog.tif'},
    {label: 'wetland', file: 'wetland_cog.tif'},
    {label: 'tiffagri', file: 'tiffagri_cog.tif'},
    {label: 'tiff2rangeland', file: 'tiff2rangeland_cog.tif'},
    {label: 'copytiffupland', file: 'copytiffupland_cog.tif'},
    // {label: 'tiffland', file: 'tiffland_cog.tif'},
    // {label: 'TWI', file: 'TWI_cog.tif'},
    {label: 'topo', file: 'topo_cog.tif'}
]

export const swGwList = [
    {label: 'Surface Water', file: 'surface_water_stations.json', color: '#ca273e', weight: 5},
    {label: 'Ground Water', file: 'ground_water_wells.json', color: '#2b82cb', weight: 5},
]
