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
import './ProjectOverview.css';

const ProjectOverview = () => {

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('Active');

  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [rangeMode, setRangeMode] = useState('range'); // default: date range
  const [visibilityFilter, setVisibilityFilter] = useState('Total');
  const [projectDurations, setProjectDurations] = useState([]);
  const [userHours, setUserHours] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectUserData, setProjectUserData] = useState([]);

  const getProjectOverview = async () => {
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    try {
      const [projects, users, data] = await Promise.all([
        axios.get("http://localhost:5000/timesheets/project-duration", {
          params: { startdate: start, enddate: end, filter: visibilityFilter },
        }),
        axios.get("http://localhost:5000/timesheets/user-project-hours", {
          params: { startdate: start, enddate: end },
        }),
        axios.get("http://localhost:5000/projects-overview", {
          params: { startdate: start, enddate: end, filter: visibilityFilter },
        }),
        // axios.get("http://localhost:5000/timesheets/project-users-hours", {
        //   params: {projectName: selectedProject,startdate: start,enddate: end,filter: visibilityFilter},
        // }),
      ]);
      setData(data.data);
      setProjectDurations(projects.data);
      setUserHours(users.data);
      // setProjectUserData(res.data);
    } catch (error) {
      console.error("Dashboard fetch error", error);
    }
  };

  const fetchProjectUsers = async (projectName) => {
    const start = startDate.toISOString().split("T")[0];
    const end = endDate.toISOString().split("T")[0];

    try {
      const res = await axios.get(
        "http://localhost:5000/timesheets/project-users-hours",
        {
          params: {
            projectName,
            startdate: start,
            enddate: end,
            filter: visibilityFilter,
          },
        }
      );
      setProjectUserData(res.data);
    } catch (error) {
      console.error("Failed to fetch users for project:", error);
      setProjectUserData([]);
    }
  };




  
  return (
    <div className="p-6 space-y-6">
      <Dropdown
        value={rangeMode}
        options={[
          { label: "Date Range", value: "range" },
          { label: "Month", value: "month" },
          { label: "Quarter", value: "quarter" },
          { label: "Half-Year", value: "half" },
        ]}
        onChange={(e) => setRangeMode(e.value)}
        placeholder="Select Range Type"
        className="w-full md:w-56"
      />
      <Dropdown
        value={visibilityFilter}
        options={[
          { label: "Total", value: "Total" },
          { label: "Active Only", value: "Active" },
          { label: "Inactive Only", value: "Inactive" },
        ]}
        onChange={(e) => setVisibilityFilter(e.value)}
        placeholder="Select Visibility"
        className="w-full md:w-56"
      />
      {rangeMode === "range" && (
        <>
          <Calendar
            value={startDate}
            onChange={(e) => setStartDate(e.value)}
            showIcon
          />
          <Calendar
            value={endDate}
            onChange={(e) => setEndDate(e.value)}
            showIcon
          />
          <Button
            label="Φόρτωσε Δεδομένα"
            onClick={getProjectOverview}
            className="p-button-raised p-button-info text-white shadow-md"
          />
        </>
      )}

      {rangeMode === "month" && (
        <>
          <Calendar
            view="month"
            dateFormat="mm/yy"
            value={startDate}
            onChange={(e) => {
              const first = new Date(
                e.value.getFullYear(),
                e.value.getMonth(),
                1
              );
              const last = new Date(
                e.value.getFullYear(),
                e.value.getMonth() + 1,
                0
              );
              setStartDate(first);
              setEndDate(last);
            }}
            showIcon
          />
          <Button
            label="Φόρτωσε Δεδομένα"
            onClick={getProjectOverview}
            className="p-button-raised p-button-info text-white shadow-md"
          />
        </>
      )}

      {rangeMode === "quarter" && (
        <>
          <Dropdown
            value={startDate}
            options={[
              {
                label: "Q1 (Jan-Mar)",
                value: new Date(new Date().getFullYear(), 0, 1),
              },
              {
                label: "Q2 (Apr-Jun)",
                value: new Date(new Date().getFullYear(), 3, 1),
              },
              {
                label: "Q3 (Jul-Sep)",
                value: new Date(new Date().getFullYear(), 6, 1),
              },
              {
                label: "Q4 (Oct-Dec)",
                value: new Date(new Date().getFullYear(), 9, 1),
              },
            ]}
            onChange={(e) => {
              const s = new Date(e.value);
              const eDate = new Date(s.getFullYear(), s.getMonth() + 3, 0);
              setStartDate(s);
              setEndDate(eDate);
            }}
            placeholder="Select Quarter"
            className="w-full md:w-64"
          />
          <Button
            label="Φόρτωσε Δεδομένα"
            onClick={getProjectOverview}
            className="p-button-raised p-button-info text-white shadow-md"
          />
        </>
      )}

      {rangeMode === "half" && (
        <>
          <Dropdown
            value={startDate}
            options={[
              {
                label: "First Half (Jan-Jun)",
                value: new Date(new Date().getFullYear(), 0, 1),
              },
              {
                label: "Second Half (Jul-Dec)",
                value: new Date(new Date().getFullYear(), 6, 1),
              },
            ]}
            onChange={(e) => {
              const s = new Date(e.value);
              const eDate = new Date(s.getFullYear(), s.getMonth() + 6, 0);
              setStartDate(s);
              setEndDate(eDate);
            }}
            placeholder="Select Half-Year"
            className="w-full md:w-64"
          />
          <Button
            label="Φόρτωσε Δεδομένα"
            onClick={getProjectOverview}
            className="p-button-raised p-button-info text-white shadow-md"
          />
        </>
      )}

      {data.length > 0 && (
        <div className="card">
          <h3>Αποτελέσματα Project Overview</h3>
          <DataTable
            value={data}
            paginator
            rows={10}
            className="p-datatable-gridlines"
          >
            <Column field="project_name" header="Project" />
            <Column field="alias" header="User" />
            <Column
              field="enabled"
              header="Enabled"
              body={(rowData) => (rowData.enabled ? "Yes" : "No")}
            />
            <Column field="duration" header="Duration (sec)" />
            <Column field="starttime" header="Start Time" />
            <Column field="lasttime" header="Last Time" />
          </DataTable>
        </div>
      )}

      <h3>📌 Project Durations</h3>
      <Chart
        type="bar"
        data={{
          labels: projectDurations.map((p) => p.project_name),
          datasets: [
            {
              label: "Hours",
              data: projectDurations.map((p) => p.hours),
              backgroundColor: "#42A5F5",
            },
          ],
        }}
        options={{
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        }}
      />
      <h3 className="mt-6">👥 Users by Project</h3>
      <Dropdown
        value={selectedProject}
        options={projectDurations.map((p) => ({
          label: p.project_name,
          value: p.project_name,
        }))}
        onChange={(e) => {
          setSelectedProject(e.value);
          fetchProjectUsers(e.value);
        }}
        placeholder="Select a project"
        className="w-full md:w-64 mb-4"
      />

      {selectedProject && projectUserData.length > 0 && (
        <Chart
          type="bar"
          data={{
            labels: projectUserData.map((u) => u.username),
            datasets: [
              {
                label: `Hours on ${selectedProject}`,
                data: projectUserData.map((u) => u.hours),
                backgroundColor: "#66BB6A",
              },
            ],
          }}
          options={{
            indexAxis: "y",
            plugins: { legend: { display: false } },
            scales: {
              x: { title: { display: true, text: "Hours" } },
              y: { title: { display: true, text: "User" } },
            },
          }}
          style={{ maxWidth: "900px", height: "400px", margin: "0 auto" }}
        />
      )}
    </div>
  );
};

export default ProjectOverview;