// React JSX version of _pm-overview.py (streamlit)
// Assumes data comes from an API endpoint returning the same structure

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

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
  const pieData = Object.entries(grouped).map(([username, projects]) => ({
    username,
    count: projects.length,
    projectList: projects.join('<br>')
  }));

  const selectedData = data.filter(d => d.username === selectedManager);
  const selectedProjects = [...new Set(selectedData.map(d => d.project_name))];

  const comparisonTargets = comparisonSelection.includes('All')
    ? [...new Set(data.map(d => d.username))]
    : comparisonSelection;

  return (
    <div className="p-6 space-y-6">
      <div className="card">
        <h2>Φίλτρο Επισκόπησης project Managers</h2>
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
            <h3>Επισκόπηση Project management</h3>
            <Plot
              data={[{
                type: 'pie',
                labels: pieData.map(p => p.username),
                values: pieData.map(p => p.count),
                text: pieData.map(p => p.projectList),
                hoverinfo: 'label+text+value+percent',
                textinfo: 'percent+label'
              }]}
              layout={{ title: 'Project Manager Overview' }}
            />
          </div>

          <div className="card">
            <h3>Επιλέξτε Project Manager απο την παρακάτω λίστα:</h3>
            <Dropdown
              value={selectedManager}
              options={managerOptions}
              onChange={(e) => setSelectedManager(e.value)}
              placeholder="Select Manager"
              className="w-full md:w-72"
              filter
            />

            {selectedManager && (
              <Plot
                data={[{
                  type: 'bar',
                  x: selectedData.map(d => d.project_name),
                  y: selectedData.map(d => d.duration),
                  text: selectedData.map(d => d.duration.toFixed(2)),
                  marker: { color: '#2b6cb0' }
                }]}
                layout={{ title: `Project Manager: ${selectedManager} - Hourly Projects Duration` }}
              />
            )}

            {selectedProjects.length > 0 && (
              <TabView>
                {selectedProjects.map((proj, i) => (
                  <TabPanel header={proj} key={i}>
                    <p><strong>Project:</strong> {proj}</p>
                    {/* Insert more project-specific visualizations if needed */}
                  </TabPanel>
                ))}
              </TabView>
            )}
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

            <Plot
              data={comparisonTargets.map(manager => {
                const subset = data.filter(d => d.username === manager);
                return {
                  type: 'bar',
                  name: manager,
                  x: subset.map(p => p.project_name),
                  y: subset.map(p => p.duration),
                };
              })}
              layout={{ barmode: 'stack', title: 'Project Manager Comparison' }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default PMOverview;
