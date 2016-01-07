//
//  InterfaceController.m
//  ShackNDateWatch WatchKit Extension
//
//  Created by OutBoxSoft on 1/6/2016.
//  2015 by OutBoxSoft. All rights reserved.
//

#import "InterfaceController.h"


@interface InterfaceController()

@end


@implementation InterfaceController

- (instancetype)init {
    self = [super init];
    
    if (self) {
        
        if ([WCSession isSupported]) {
            WCSession* session = [WCSession defaultSession];
            session.delegate = self;
            [session activateSession];
        }
    }
    
    return self;
}

- (void)awakeWithContext:(id)context {
    [super awakeWithContext:context];

    // Configure interface objects here.
}

- (void)willActivate {
    // This method is called when watch view controller is about to be visible to user
    [super willActivate];
}

- (void)didDeactivate {
    // This method is called when watch view controller is no longer visible
    [super didDeactivate];
}

@end
