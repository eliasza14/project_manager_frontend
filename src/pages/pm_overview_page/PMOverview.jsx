import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Chart } from 'primereact/chart';
import './PMOverview.css';

const PMOverview = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [comparisonSelection, setComparisonSelection] = useState([]);

  useEffect(() => {
    if (submitted) fetchData();
  }, [submitted]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/summary');
      const filtered = res.data.filter(entry => entry.username !== 'ADMINISTRATOR');
      setData(filtered.map(d => ({ ...d, duration: parseInt(d.duration) / 3600 })));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const managerOptions = [...new Set(data.map(d => d.username))].map(name => ({ label: name, value: name }));

  const grouped = data.reduce((acc, cur) => {
    acc[cur.username] = acc[cur.username] || [];
    acc[cur.username].push(cur.project_name);
    return acc;
  }, {});

  const pieData = () => {
  const grouped = data.reduce((acc, cur) => {
    if (!acc[cur.username]) acc[cur.username] = new Set();
    acc[cur.username].add(cur.project_name);
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const values = labels.map(label => grouped[label].size);
  const projectLists = labels.map(label => Array.from(grouped[label]));

  return {
    labels,
    datasets: [{
      data: values,
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#FF6384'],
      projectLists // 👈 Add this for tooltip access
    }]
  };
};

  const selectedData = data.filter(d => d.username === selectedManager);
  const selectedProjects = [...new Set(selectedData.map(d => d.project_name))];

  const comparisonTargets = comparisonSelection.includes('All')
    ? [...new Set(data.map(d => d.username))]
    : comparisonSelection;

  const comparisonBarData = () => {
    const datasets = comparisonTargets.map((manager, index) => {
      const subset = data.filter(d => d.username === manager);
      return {
        label: manager,
        data: subset.map(p => p.duration),
        backgroundColor: `hsl(${index * 60}, 70%, 60%)`
      };
    });

    const allProjects = [...new Set(data.flatMap(d => d.project_name))];

    return {
      labels: allProjects,
      datasets
    };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="card">
        <h2>Φίλτρο Επισκόπησης Project Managers</h2>
        <div className="flex gap-4 items-end">
          <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} showIcon className="w-full md:w-56" />
          <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} showIcon className="w-full md:w-56" />
          <Button label="Submit" onClick={() => setSubmitted(true)} className="p-button-info" />
        </div>
      </div>

      {submitted && data.length > 0 && (
        <>
          <div className="card">
            <h3>Σύνολο δεδομένων</h3>
            <DataTable value={data} paginator rows={10} stripedRows responsiveLayout="scroll">
              <Column field="username" header="Project Manager" />
              <Column field="project_name" header="Project Name" />
              <Column field="duration" header="Duration (h)" />
              <Column field="time_budget" header="Budget" />
              <Column field="active" header="Visible" body={(row) => (row.active ? 'Yes' : 'No')} />
            </DataTable>
          </div>

          <div className="card">
            <h3>Επισκόπηση Project Management</h3>
            <Chart
              type="pie"
              data={pieData()}
              options={{
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: (tooltipItem) => {
                        const index = tooltipItem.dataIndex;
                        const label = tooltipItem.chart.data.labels[index];
                        const projects = tooltipItem.chart.data.datasets[0].projectLists[index] || [];
                        return [
                          `${label}:`,
                          ...projects.map(p => `• ${p}`),
                          `Total Projects: ${projects.length}`
                        ];
                      }
                    }
                  }
                }
              }}
              style={{ maxWidth: '700px', height: '400px', margin: '0 auto' }}
/>
          </div>

          <div className="card">
            <h3>Επιλέξτε Project Manager από τη λίστα</h3>
            <Dropdown
              value={selectedManager}
              options={managerOptions}
              onChange={(e) => setSelectedManager(e.value)}
              placeholder="Select Manager"
              className="w-full md:w-72"
              filter
            />

            {selectedManager && selectedData.length > 0 && (
              <Chart
                type="bar"
                data={{
                  labels: selectedData.map(d => d.project_name),
                  datasets: [{
                    label: 'Duration (h)',
                    data: selectedData.map(d => d.duration),
                    backgroundColor: '#2b6cb0'
                  }]
                }}
                options={{
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    x: { title: { display: true, text: 'Project' } },
                    y: { title: { display: true, text: 'Hours' } }
                  }
                }}
                style={{ maxWidth: '800px', height: '400px', margin: '2rem auto' }}
              />
            )}

            {/* {selectedProjects.length > 0 && (
              <TabView>
                {selectedProjects.map((proj, i) => (
                  <TabPanel header={proj} key={i}>
                    <p><strong>Project:</strong> {proj}</p>
                  </TabPanel>
                ))}
              </TabView>
            )} */}
          </div>

          <div className="card">
            <h3>Σύγκριση Project Managers</h3>
            <MultiSelect
              value={comparisonSelection}
              options={[...managerOptions, { label: 'All', value: 'All' }]}
              onChange={(e) => setComparisonSelection(e.value)}
              placeholder="Select managers"
              display="chip"
              className="w-full md:w-96"
            />

            <Chart
              type="bar"
              data={comparisonBarData()}
              options={{
                plugins: { legend: { position: 'top' } },
                responsive: true,
                scales: {
                  x: { stacked: true, title: { display: true, text: 'Project' } },
                  y: { stacked: true, title: { display: true, text: 'Duration (h)' } }
                }
              }}
              style={{ maxWidth: '1000px', height: '500px', margin: '2rem auto' }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PMOverview;