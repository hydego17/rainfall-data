import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReactOfficial from 'highcharts-react-official';

if (typeof Highcharts === 'object') {
  require('highcharts/highcharts-more')(Highcharts);
  require('highcharts/modules/exporting')(Highcharts);
  require('highcharts/modules/data')(Highcharts);
  require('highcharts/modules/export-data')(Highcharts);
  require('highcharts/modules/accessibility')(Highcharts);
}

const HighchartsReact = React.forwardRef<HTMLDivElement, HighchartsReactOfficial.Props>(({ ...props }, ref) => {
  // Create container for the chart
  return <HighchartsReactOfficial {...props} highcharts={Highcharts} ref={ref} />;
});

HighchartsReact.displayName = 'HighchartsReact';

export default HighchartsReact;
