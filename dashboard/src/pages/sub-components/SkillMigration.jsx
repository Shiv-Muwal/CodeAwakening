import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Database, ArrowRight, CheckCircle, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const SkillMigration = () => {
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rollbackLoading, setRollbackLoading] = useState(false);

  const handleMigration = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/unified-skills/migrate",
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setMigrationStatus(response.data);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Migration error:", error);
      toast.error(error.response?.data?.message || "Migration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async () => {
    setRollbackLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/unified-skills/rollback",
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setMigrationStatus(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Rollback error:", error);
      toast.error(error.response?.data?.message || "Rollback failed");
    } finally {
      setRollbackLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[100vh] sm:gap-4 sm:py-4 sm:pl-14">
      <div className="w-[100%] px-5 md:w-[800px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Database className="w-6 h-6" />
              Skills System Migration
            </CardTitle>
            <p className="text-muted-foreground">
              Migrate your existing skills and software applications to the new unified system.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Warning Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Notes</h4>
                  <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                    <li>• This will create a new unified skills collection</li>
                    <li>• Your existing skills and software applications will remain unchanged</li>
                    <li>• You can rollback this migration if needed</li>
                    <li>• After migration, use the new unified skills interface</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Migration Status */}
            {migrationStatus && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h4 className="font-medium text-green-800">Migration Completed</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {migrationStatus.migrated?.skills || 0}
                      </div>
                      <div className="text-sm text-green-600">Skills Migrated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">
                        {migrationStatus.migrated?.applications || 0}
                      </div>
                      <div className="text-sm text-green-600">Applications Migrated</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Migration Flow Visualization */}
            <div className="space-y-4">
              <h4 className="font-medium">Migration Process</h4>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Skills Collection</Badge>
                  <span className="text-sm text-muted-foreground">Current skills data</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Software Apps</Badge>
                  <span className="text-sm text-muted-foreground">Current applications</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-500">Unified Skills</Badge>
                  <span className="text-sm text-muted-foreground">New unified system</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!migrationStatus ? (
                <Button
                  onClick={handleMigration}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Migrating...
                    </>
                  ) : (
                    <>
                      <Database className="w-4 h-4 mr-2" />
                      Start Migration
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleRollback}
                  disabled={rollbackLoading}
                  variant="destructive"
                  className="flex-1"
                >
                  {rollbackLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Rolling Back...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Rollback Migration
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Post-Migration Instructions */}
            {migrationStatus && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Navigate to "Manage Unified Skills" to see your migrated data</li>
                  <li>• Use "Add Unified Skill" to add new skills and applications</li>
                  <li>• The new system supports categories, proficiency levels, and more</li>
                  <li>• Your original data remains unchanged as a backup</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillMigration;