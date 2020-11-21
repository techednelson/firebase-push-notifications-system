'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">firebase-push-notifications-system documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-38b1a0572c0b63cb94c6b5ca1cf8df52"' : 'data-target="#xs-controllers-links-module-AppModule-38b1a0572c0b63cb94c6b5ca1cf8df52"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-38b1a0572c0b63cb94c6b5ca1cf8df52"' :
                                            'id="xs-controllers-links-module-AppModule-38b1a0572c0b63cb94c6b5ca1cf8df52"' }>
                                            <li class="link">
                                                <a href="controllers/NextClientController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NextClientController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-3e55fd21e3383d255f1b959e1a02df3d"' : 'data-target="#xs-controllers-links-module-AuthModule-3e55fd21e3383d255f1b959e1a02df3d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-3e55fd21e3383d255f1b959e1a02df3d"' :
                                            'id="xs-controllers-links-module-AuthModule-3e55fd21e3383d255f1b959e1a02df3d"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-3e55fd21e3383d255f1b959e1a02df3d"' : 'data-target="#xs-injectables-links-module-AuthModule-3e55fd21e3383d255f1b959e1a02df3d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-3e55fd21e3383d255f1b959e1a02df3d"' :
                                        'id="xs-injectables-links-module-AuthModule-3e55fd21e3383d255f1b959e1a02df3d"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtAccessTokenStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtAccessTokenStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtRefreshTokenStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtRefreshTokenStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FcmAdminServerModule.html" data-type="entity-link">FcmAdminServerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-FcmAdminServerModule-4ad8b4779d8ca42c8e7b33838f86c3de"' : 'data-target="#xs-controllers-links-module-FcmAdminServerModule-4ad8b4779d8ca42c8e7b33838f86c3de"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FcmAdminServerModule-4ad8b4779d8ca42c8e7b33838f86c3de"' :
                                            'id="xs-controllers-links-module-FcmAdminServerModule-4ad8b4779d8ca42c8e7b33838f86c3de"' }>
                                            <li class="link">
                                                <a href="controllers/FcmController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FcmController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/NotificationsController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NotificationsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/SubscribersController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SubscribersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-FcmAdminServerModule-4ad8b4779d8ca42c8e7b33838f86c3de"' : 'data-target="#xs-injectables-links-module-FcmAdminServerModule-4ad8b4779d8ca42c8e7b33838f86c3de"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FcmAdminServerModule-4ad8b4779d8ca42c8e7b33838f86c3de"' :
                                        'id="xs-injectables-links-module-FcmAdminServerModule-4ad8b4779d8ca42c8e7b33838f86c3de"' }>
                                        <li class="link">
                                            <a href="injectables/FcmService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FcmService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>NotificationsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SubscribersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SubscribersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link">AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FcmController.html" data-type="entity-link">FcmController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/NextClientController.html" data-type="entity-link">NextClientController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/NotificationsController.html" data-type="entity-link">NotificationsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SubscribersController.html" data-type="entity-link">SubscribersController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/MatchConstraint.html" data-type="entity-link">MatchConstraint</a>
                            </li>
                            <li class="link">
                                <a href="classes/MulticastRequestDto.html" data-type="entity-link">MulticastRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notification.html" data-type="entity-link">Notification</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationResponseDto.html" data-type="entity-link">NotificationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignInRequestDto.html" data-type="entity-link">SignInRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SignUpDto.html" data-type="entity-link">SignUpDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SingleRequestDto.html" data-type="entity-link">SingleRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Subscriber.html" data-type="entity-link">Subscriber</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubscriptionRequestDto.html" data-type="entity-link">SubscriptionRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SubscriptionResponseDto.html" data-type="entity-link">SubscriptionResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TopicRequestDto.html" data-type="entity-link">TopicRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TopicsResponseDto.html" data-type="entity-link">TopicsResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FcmService.html" data-type="entity-link">FcmService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAccessTokenGuard.html" data-type="entity-link">JwtAccessTokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAccessTokenStrategy.html" data-type="entity-link">JwtAccessTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshTokenGuard.html" data-type="entity-link">JwtRefreshTokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshTokenStrategy.html" data-type="entity-link">JwtRefreshTokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link">NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubscribersService.html" data-type="entity-link">SubscribersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/BasicAuthGuard.html" data-type="entity-link">BasicAuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link">JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MessagePayload.html" data-type="entity-link">MessagePayload</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});