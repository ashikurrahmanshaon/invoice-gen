const Aggregator = require('./engine/Aggregator.cjs');
const { JSONExporter, CSVExporter, MarkdownExporter } = require('./exporters/Exporters.cjs');

async function main() {
  console.log('🚀 Starting Invoice-Gen.net Analytics Engine...');
  
  const type = process.argv[2] || 'weekly'; // 'weekly' or 'monthly'
  const dateRange = type === 'weekly' ? 'last_7_days' : 'last_30_days';

  const aggregator = new Aggregator();
  const data = await aggregator.run(dateRange);

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${type}_report_${timestamp}`;

  // Generate Reports
  JSONExporter.export(data, 'latest_data'); // Always output latest_data.json for the local dashboard
  JSONExporter.export(data, filename);
  CSVExporter.export(data, filename);
  MarkdownExporter.export(data, filename);

  console.log('✅ Analytics generation complete.');
}

main().catch(console.error);
