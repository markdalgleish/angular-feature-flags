(function () {
    'use strict';

    describe('Service: flags', function() {
        var flagsService,
            overrideService,
            $http;

        beforeEach(module('feature-flags'));

        beforeEach(inject(function(flags, override, $httpBackend) {
            flagsService = flags;
            overrideService = override;
            $http = $httpBackend;
        }));

        describe('when I retrieve the list of flags', function() {
            var flags = [
                { active: true, key: 'FLAG_KEY' },
                { active: false, key: 'FLAG_KEY_2' }
            ];

            beforeEach(function() {
                $http.when('GET', 'data/flags.json').respond(flags);
                flagsService.fetch();
                $http.flush();
            });

            afterEach(function() {
                $http.verifyNoOutstandingExpectation();
                $http.verifyNoOutstandingRequest();
            });

            it('should return all available flags', function() {
                expect(flagsService.get()).toEqual(flags);
            });
        });

        describe('when I enable a feature flag override', function() {
            var flag = { active: null, key: 'FLAG_KEY' };

            beforeEach(function() {
                spyOn(overrideService, 'set');
                flagsService.enable(flag);
            });

            it('should set the flag with the correct name and value', function() {
                expect(overrideService.set).toHaveBeenCalledWith(flag.key, true);
            });

            it('should set the flag as active', function() {
                expect(flag.active).toBe(true);
            });
        });
        
        describe('when I disable a feature flag override', function() {
            var flag = { active: null, key: 'FLAG_KEY' };

            beforeEach(function() {
                spyOn(overrideService, 'set');
                flagsService.disable(flag);
            });

            it('should set the flag with the correct name and value', function() {
                expect(overrideService.set).toHaveBeenCalledWith(flag.key, false);
            });

            it('should set the flag as inactive', function() {
                expect(flag.active).toBe(false);
            });
        });

        describe('when I reset a feature flag to default', function() {
            var originalFlagValue = true,
                flag = { active: originalFlagValue, key: 'FLAG_KEY' };

            beforeEach(function() {
                $http.when('GET', 'data/flags.json').respond([ flag ]);
                flagsService.fetch();
                $http.flush();

                spyOn(overrideService, 'set');
                flagsService.disable(flag);

                spyOn(overrideService, 'remove');
                flagsService.reset(flag);
            });

            it('should remove the flag', function() {
                expect(overrideService.remove).toHaveBeenCalledWith(flag.key);
            });

            it('should reset the flag to the default value', function() {
                expect(flag.active).toBe(originalFlagValue);
            });
        });
        
        describe('when I check if there is an local override', function() {
            var flag = { active: null, key: 'FLAG_KEY' };

            describe('if there is', function() {
                beforeEach(function() {
                    spyOn(overrideService, 'isPresent').andReturn(true);
                });

                it('should return true when there is', function() {
                    expect(flagsService.isOverridden(flag.key)).toBe(true);
                });
            });
            
            describe('if there is not', function() {
                beforeEach(function() {
                    spyOn(overrideService, 'isPresent').andReturn(false);
                });

                it('should return true when there is', function() {
                    expect(flagsService.isOverridden(flag.key)).toBe(false);
                });
            });
        });

        describe('when I check a feature flags state', function() {
            describe('if the feature is disabled on the server', function() {
                var flag = { active: false, key: 'FLAG_KEY' };

                beforeEach(function() {
                    $http.when('GET', 'data/flags.json').respond([ flag ]);
                    flagsService.fetch();
                    $http.flush();
                });

                afterEach(function() {
                    $http.verifyNoOutstandingExpectation();
                    $http.verifyNoOutstandingRequest();
                });
                
                describe('and there is a local override to turn it on', function() {
                    beforeEach(function() {
                        spyOn(overrideService, 'isPresent').andReturn(true);
                        spyOn(overrideService, 'get').andReturn('true');
                    });
                    
                    it('should report the feature as being on', function() {
                        expect(flagsService.isOn(flag.key)).toBe(true);
                    });
                });

                describe('and there is no local override to turn it on', function() {
                    beforeEach(function() {
                        spyOn(overrideService, 'isPresent').andReturn(false);
                    });

                    it('should report the feature as being off', function() {
                        expect(flagsService.isOn(flag.key)).toBe(flag.active);
                    });
                });
            });

            describe('if the feature is enabled on the server', function() {
                var flag = { active: true, key: 'FLAG_KEY' };

                beforeEach(function() {
                    $http.when('GET', 'data/flags.json').respond([ flag ]);
                    flagsService.fetch();
                    $http.flush();
                });

                afterEach(function() {
                    $http.verifyNoOutstandingExpectation();
                    $http.verifyNoOutstandingRequest();
                });
                
                describe('and there is a local override to turn it off', function() {
                    beforeEach(function() {
                        spyOn(overrideService, 'isPresent').andReturn(true);
                        spyOn(overrideService, 'get').andReturn('false');
                    });

                    it('should report the feature as being off', function() {
                        expect(flagsService.isOn(flag.key)).toBe(false);
                    });
                });

                describe('and there is no local override to turn it off', function() {
                    beforeEach(function() {
                        spyOn(overrideService, 'isPresent').andReturn(false);
                    });

                    it('should report the feature as being on', function() {
                        expect(flagsService.isOn(flag.key)).toBe(true);
                    });
                });
            });
        });
    });
}());
