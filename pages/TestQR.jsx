import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { Bell, Download, Edit, Locate, Lock, RefreshCcw, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample data for the chart
const dataset = [
  { month: 'Jan', london: 18.9, paris: 28.6, newYork: 39.6, seoul: 21.5 },
  { month: 'Feb', london: 28.8, paris: 28.3, newYork: 34.3, seoul: 38.0 },
  { month: 'Mar', london: 39.3, paris: 37.2, newYork: 34.3, seoul: 43.5 },
  { month: 'Apr', london: 81.4, paris: 47.7, newYork: 52.6, seoul: 20.5 },
  { month: 'May', london: 47.0, paris: 58.6, newYork: 71.5, seoul: 38.0 },
  { month: 'Jun', london: 20.4, paris: 11.4, newYork: 55.7, seoul: 88.5 },
  { month: 'Jul', london: 24.0, paris: 38.7, newYork: 53.0, seoul: 14.5 },
  { month: 'Aug', london: 35.6, paris: 66.9, newYork: 83.3, seoul: 55.0 },
  { month: 'Sep', london: 56.7, paris: 29.6, newYork: 24.7, seoul: 46.5 },
  { month: 'Oct', london: 60.4, paris: 52.4, newYork: 42.8, seoul: 77.0 },
  { month: 'Nov', london: 65.2, paris: 54.6, newYork: 58.1, seoul: 21.5 },
  { month: 'Dec', london: 30.6, paris: 32.9, newYork: 34.5, seoul: 22.0 },
];

function valueFormatter(value) {
  return `${value}mm`;
}

function QRDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* QR Code Section */}
        <Card>
          <CardContent className="p-6">
            <img
              src="/placeholder.svg?height=300&width=300"
              alt="QR Code"
              className="w-full aspect-square"
            />
            <div className="mt-4 space-y-2">
              <p className="text-sm text-muted-foreground">No folder</p>
              <p className="text-sm text-muted-foreground">https://qr.be/RP4M</p>
              <p className="text-sm text-muted-foreground">
                Created: 12/14/2024 20:00
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Controls Section */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <h3 className="text-2xl font-bold">34</h3>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unique scans</p>
                <h3 className="text-2xl font-bold">7</h3>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Location</p>
                <h3 className="text-2xl font-bold">PK</h3>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Device</p>
                <h3 className="text-2xl font-bold">PC browser</h3>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <Button variant="outline" className="w-full">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Retarget
              </Button>
              <Button variant="outline" className="w-full">
                <Bell className="w-4 h-4 mr-2" />
                Notify
              </Button>
              <Button variant="outline" className="w-full">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" className="w-full">
                <Lock className="w-4 h-4 mr-2" />
                Password
              </Button>
              <Button variant="outline" className="w-full">
                <Locate className="w-4 h-4 mr-2" />
                GPS
              </Button>
              <Button variant="primary" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Rainfall Over Time</span>
            <div className="flex gap-4">
              <Select defaultValue="asia-karachi">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asia-karachi">Asia/Karachi</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="europe-london">Europe/London</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="this-month">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This month</SelectItem>
                  <SelectItem value="last-month">Last month</SelectItem>
                  <SelectItem value="this-year">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              london: { label: "London", color: "hsl(var(--primary))" },
              paris: { label: "Paris", color: "hsl(var(--secondary))" },
              newYork: { label: "New York", color: "hsl(var(--accent))" },
              seoul: { label: "Seoul", color: "hsl(var(--muted))" },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataset} margin={{ top: 10, right: 10, left: 20, bottom: 20 }}>
                <XAxis dataKey="month" scale="band" />
                <YAxis 
                  label={{ value: 'rainfall (mm)', angle: -90, position: 'insideLeft', offset: 0 }}
                  tickFormatter={valueFormatter}
                />
                <Tooltip formatter={valueFormatter} />
                <Legend />
                <Bar dataKey="london" fill="hsl(var(--primary))" />
                <Bar dataKey="paris" fill="hsl(var(--secondary))" />
                <Bar dataKey="newYork" fill="hsl(var(--accent))" />
                <Bar dataKey="seoul" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Device and Location Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Scans By Device */}
        <Card>
          <CardHeader>
            <CardTitle>Scans By Device</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ChartContainer
              config={{
                series1: { label: "Series 1", color: "hsl(var(--primary))" },
                series2: { label: "Series 2", color: "hsl(var(--secondary))" },
                series3: { label: "Series 3", color: "hsl(var(--accent))" },
                series4: { label: "Series 4", color: "hsl(var(--muted))" },
              }}
              className="h-[290px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { quarter: 'Q1', series1: 35, series2: 51, series3: 15, series4: 60 },
                    { quarter: 'Q2', series1: 44, series2: 6, series3: 25, series4: 50 },
                    { quarter: 'Q3', series1: 24, series2: 49, series3: 30, series4: 15 },
                    { quarter: 'Q4', series1: 34, series2: 30, series3: 50, series4: 25 },
                  ]}
                  margin={{ top: 10, right: 10, left: 40, bottom: 30 }}
                >
                  <XAxis dataKey="quarter" scale="band" />
                  <YAxis />
                  <Bar dataKey="series1" fill="hsl(var(--primary))" />
                  <Bar dataKey="series2" fill="hsl(var(--secondary))" />
                  <Bar dataKey="series3" fill="hsl(var(--accent))" />
                  <Bar dataKey="series4" fill="hsl(var(--muted))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle>Top locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Location
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Scan
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium">
                      Top Device
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 align-middle">Karachi</td>
                    <td className="p-4 align-middle">5</td>
                    <td className="p-4 align-middle">AndroidOS</td>
                  </tr>
                  <tr>
                    <td className="p-4 align-middle">Islamabad</td>
                    <td className="p-4 align-middle">1</td>
                    <td className="p-4 align-middle">Desktop</td>
                  </tr>
                </tbody>
              </table>
              <div className="flex items-center justify-center space-x-2 py-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 min-w-[2rem] px-2"
                >
                  1
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default QRDashboard;

